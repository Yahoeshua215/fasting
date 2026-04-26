import type { EatingWindow } from './db';
import { HOUR_MS, MIN_MS } from './time';
import { getProtocol, type ProtocolId } from './protocols';

export interface FastingStatus {
  kind: 'fasting';
  /** Timestamp the current fast began (close of the previous eating window). */
  sinceMs: number;
  elapsedMs: number;
  targetMs: number;
  /** Last completed eating window — the one that closed to start this fast. */
  lastWindow: EatingWindow;
}

export interface EatingStatus {
  kind: 'eating';
  startedAt: number;
  elapsedMs: number;
  /** Goal length of the eating window (undefined for 24h+ protocols). */
  targetMs?: number;
  window: EatingWindow;
}

export interface EmptyStatus {
  kind: 'empty';
}

export type TrackerStatus = FastingStatus | EatingStatus | EmptyStatus;

export function deriveStatus(
  windows: EatingWindow[],
  now: number,
  protocolId: ProtocolId | undefined,
): TrackerStatus {
  if (windows.length === 0) return { kind: 'empty' };

  const protocol = protocolId ? getProtocol(protocolId) : undefined;
  const fastTargetMs = (protocol?.hours ?? 18) * HOUR_MS;
  const eatingTargetMs =
    protocol?.eatingHours !== undefined ? protocol.eatingHours * HOUR_MS : undefined;

  // An open window (no endedAt) always means we're eating, regardless of
  // where it falls in chronological order relative to closed windows.
  const openWindow = windows.find(w => w.endedAt === undefined);
  if (openWindow) {
    return {
      kind: 'eating',
      startedAt: openWindow.startedAt,
      elapsedMs: now - openWindow.startedAt,
      targetMs: eatingTargetMs,
      window: openWindow,
    };
  }

  // All windows are closed — fasting since the most recent endedAt.
  const sorted = [...windows].sort((a, b) => a.startedAt - b.startedAt);
  const latest = sorted[sorted.length - 1];

  return {
    kind: 'fasting',
    sinceMs: latest.endedAt!,
    elapsedMs: now - latest.endedAt!,
    targetMs: fastTargetMs,
    lastWindow: latest,
  };
}

export interface WorkoutWindow {
  opens: number;
  peak: number;
  closes: number;
  state: 'before' | 'open' | 'peak' | 'closing' | 'past';
  msUntilOpen: number;
  msUntilClose: number;
}

export function computeWorkoutWindow(
  fastStartMs: number,
  targetMs: number,
  now: number,
  leadHours = 2,
): WorkoutWindow {
  const targetEnd = fastStartMs + targetMs;
  const opens = targetEnd - leadHours * HOUR_MS;
  const closes = targetEnd - 30 * MIN_MS;
  const peak = opens + 30 * MIN_MS;

  let state: WorkoutWindow['state'];
  if (now < opens) state = 'before';
  else if (now > closes) state = 'past';
  else if (now < peak) state = 'open';
  else if (now > closes - 30 * MIN_MS) state = 'closing';
  else state = 'peak';

  return {
    opens,
    peak,
    closes,
    state,
    msUntilOpen: opens - now,
    msUntilClose: closes - now,
  };
}
