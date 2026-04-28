import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFastStore } from '@/store/useFastStore';
import { useNow } from '@/lib/useNow';
import { deriveStatus, computeWorkoutWindow } from '@/lib/state';
import { RingTimer } from '@/components/RingTimer';
import { PhaseRibbon } from '@/components/PhaseRibbon';
import { WindowEditor } from '@/components/WindowEditor';
import { EatingWindowControls } from '@/components/EatingWindowControls';
import { MealLogger } from '@/components/MealLogger';
import { WindowMealCard } from '@/components/WindowMealCard';
import { currentPhase } from '@/lib/phases';
import { getProtocol } from '@/lib/protocols';
import {
  HOUR_MS,
  formatHMS,
  formatTimeOfDay,
  formatRelativeFrom,
  toLocalInputValue,
  fromLocalInputValue,
} from '@/lib/time';
import { clamp } from '@/lib/utils';

type Drawer = null | 'log-previous' | 'edit-latest';

export function Home() {
  const windows = useFastStore(s => s.windows);
  const settings = useFastStore(s => s.settings);
  const loading = useFastStore(s => s.loading);
  const openWindow = useFastStore(s => s.openWindow);
  const closeWindow = useFastStore(s => s.closeWindow);
  const updateWindow = useFastStore(s => s.updateWindow);
  const now = useNow();
  const [drawer, setDrawer] = useState<Drawer>(null);

  if (loading) return <div className="card text-slate-400">Loading…</div>;

  const protocolId = settings.defaultProtocol ?? '18:6';
  const protocol = getProtocol(protocolId);
  const leadHours = settings.workoutLeadHours ?? 2;
  const status = deriveStatus(windows, now, protocolId);
  const latest = windows[windows.length - 1];

  if (status.kind === 'empty') return <Onboarding />;

  // ── What each button does depends on current state ──────────────────────
  async function handleFirstMeal(ts: number) {
    if (status.kind === 'eating' && status.window.id) {
      await updateWindow(status.window.id, { startedAt: ts });
    } else {
      await openWindow(ts);
    }
  }

  async function handleLastMeal(ts: number) {
    if (status.kind === 'eating') {
      await closeWindow(ts);
    } else if (status.kind === 'fasting' && status.lastWindow.id) {
      await updateWindow(status.lastWindow.id, { endedAt: ts });
    }
  }

  // ── Eating view ──────────────────────────────────────────────────────────
  if (status.kind === 'eating') {
    const eatingHours = protocol.eatingHours ?? 6;
    const targetMs = status.targetMs ?? eatingHours * HOUR_MS;
    const remainingMs = targetMs - status.elapsedMs;
    const overshoot = remainingMs < 0;
    const progress = clamp(status.elapsedMs / targetMs, 0, 1);

    return (
      <div className="space-y-4 sm:space-y-6">
        <section className="card">
          <div className="label">Eating window — {protocol.name}</div>
          <h1 className="mt-1 font-display text-xl sm:text-2xl">
            In your {eatingHours}h eating window
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {overshoot
              ? `Window closed ${formatRelativeFrom(-remainingMs)} ago — end eating to start your ${protocol.hours}h fast.`
              : `${formatTimeOfDay(status.startedAt + targetMs)} hits ${eatingHours}h`}
          </p>

          <div className="mt-4">
            <EatingWindowControls
              status={status}
              eatingHours={eatingHours}
              onFirstMeal={handleFirstMeal}
              onLastMeal={handleLastMeal}
            />
          </div>

          <div className="mt-5 sm:mt-6">
            <RingTimer
              progress={progress}
              primary={overshoot ? `+${formatHMS(-remainingMs)}` : formatHMS(status.elapsedMs)}
              secondary={
                overshoot
                  ? `past ${eatingHours}h eating window`
                  : `of ${eatingHours}h target`
              }
              caption={
                overshoot
                  ? `Tap "End eating" when done — your ${protocol.hours}h fast starts then.`
                  : `${formatHMS(Math.max(0, remainingMs))} of window left`
              }
            />
          </div>

          <div className="mt-4">
            <button
              className="text-xs text-slate-400 hover:text-slate-200 min-h-[44px] flex items-center"
              onClick={() => setDrawer(drawer === 'edit-latest' ? null : 'edit-latest')}
            >
              {drawer === 'edit-latest' ? 'Hide' : 'Edit full window →'}
            </button>
            {drawer === 'edit-latest' && latest ? (
              <div className="mt-3">
                <WindowEditor
                  window={latest}
                  title="Edit this eating window"
                  submitLabel="Update"
                  onDone={() => setDrawer(null)}
                  onCancel={() => setDrawer(null)}
                />
              </div>
            ) : null}
          </div>
        </section>

        {status.window.id ? <MealLogger windowId={status.window.id} weightLb={settings.weightLb} /> : null}

        <section className="card">
          <div className="label">During the eating window</div>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
            <li>· Protein-forward meal. Target: {proteinTarget(settings.weightLb)}.</li>
            <li>· Skew real food — avoid seed oils, charred prep, sugary drinks.</li>
            <li>· Plant variety this week, not just fiber grams.</li>
            <li>· Fermented food (kefir, sauerkraut, kimchi) for postbiotics + K2.</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/eating" className="btn-ghost">Eating reference</Link>
            <Link to="/learn" className="btn-ghost">Why it works</Link>
          </div>
        </section>
      </div>
    );
  }

  // ── Fasting view ─────────────────────────────────────────────────────────
  const elapsedMs = status.elapsedMs;
  const targetMs = status.targetMs;
  const remainingMs = targetMs - elapsedMs;
  const overshoot = remainingMs < 0;
  const progress = clamp(elapsedMs / targetMs, 0, 1);
  const elapsedHours = elapsedMs / HOUR_MS;
  const totalHours = targetMs / HOUR_MS;
  const phase = currentPhase(elapsedHours);
  const workout = computeWorkoutWindow(status.sinceMs, targetMs, now, leadHours);
  const targetEndAt = status.sinceMs + targetMs;

  const eatingHours = protocol.eatingHours ?? 6;
  const prevWindowDurationMs = status.lastWindow.endedAt!
    - status.lastWindow.startedAt;

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="card">
        <div className="label">Fasting — target {protocol.name}</div>
        <h1 className="mt-1 font-display text-xl sm:text-2xl">
          {phase.label}
          {elapsedHours >= 16 ? ' · in ketosis' : ''}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {overshoot
            ? `${formatRelativeFrom(elapsedMs - targetMs)} past ${totalHours}h target`
            : `${formatTimeOfDay(targetEndAt)} hits ${totalHours}h`}
        </p>
        <p className="mt-0.5 text-xs text-slate-600">
          Ate for {formatRelativeFrom(prevWindowDurationMs)} · {formatTimeOfDay(status.lastWindow.startedAt)} – {formatTimeOfDay(status.sinceMs)}
        </p>

        <div className="mt-4">
          <EatingWindowControls
            status={status}
            eatingHours={eatingHours}
            onFirstMeal={handleFirstMeal}
            onLastMeal={handleLastMeal}
          />
        </div>

        <div className="mt-5 sm:mt-6">
          <RingTimer
            progress={progress}
            primary={overshoot ? `+${formatHMS(elapsedMs - targetMs)}` : formatHMS(elapsedMs)}
            secondary={overshoot ? `past ${totalHours}h fast target` : `of ${totalHours}h fast`}
            caption={
              overshoot
                ? "Past target — break with intention when ready."
                : `${formatHMS(Math.max(0, remainingMs))} to target`
            }
          />
        </div>

        <div className="mt-4">
          <button
            className="text-xs text-slate-400 hover:text-slate-200 min-h-[44px] flex items-center"
            onClick={() => setDrawer(drawer === 'edit-latest' ? null : 'edit-latest')}
          >
            {drawer === 'edit-latest' ? 'Hide' : 'Edit the window that ended this fast →'}
          </button>
          {drawer === 'edit-latest' && latest ? (
            <div className="mt-3">
              <WindowEditor
                window={latest}
                title="Edit last eating window"
                submitLabel="Update"
                onDone={() => setDrawer(null)}
                onCancel={() => setDrawer(null)}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="label mb-2">Metabolic timeline</div>
        <PhaseRibbon elapsedHours={elapsedHours} totalHours={totalHours} />
      </section>

      {/* ── Eating window meal history ── */}
      <PastWindowHistory windows={windows} settings={settings} />

      <section className="card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <div className="label">Workout window</div>
            <h2 className="mt-1 font-display text-base sm:text-lg">Train at the peak of the fast</h2>
          </div>
          <span
            className={
              workout.state === 'past'
                ? 'pill border-slate-700 text-slate-500 self-start'
                : workout.state === 'before'
                  ? 'pill self-start'
                  : 'pill border-cyan-700/60 text-cyan-200 self-start'
            }
          >
            {workout.state === 'before'
              ? `Opens in ${formatRelativeFrom(workout.msUntilOpen)}`
              : workout.state === 'past'
                ? 'Window passed'
                : workout.state === 'closing'
                  ? `Closes in ${formatRelativeFrom(workout.msUntilClose)}`
                  : 'Open now'}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-300">
          Optimal window — roughly the last {leadHours}h of your fast. Resistance + HIIT preferred.
        </p>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-slate-900/60 p-3">
            <div className="label">Window</div>
            <div className="text-slate-200">
              {formatTimeOfDay(workout.opens)} – {formatTimeOfDay(workout.closes)}
            </div>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-3">
            <div className="label">Status</div>
            <div className="text-slate-200">
              {workout.state === 'before'
                ? `Opens ${formatTimeOfDay(workout.opens)}`
                : workout.state === 'past'
                  ? 'Passed for today'
                  : 'Go now'}
            </div>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-3">
            <div className="label">Preferred</div>
            <div className="text-slate-200">Resistance · HIIT · bodyweight flow</div>
          </div>
        </div>
        {settings.sex === 'female' ? (
          <p className="mt-3 text-xs text-amber-200/80">
            Long fasted aerobic work can drive catabolism in women. Keep aerobic short; resistance
            and HIIT translate well.
          </p>
        ) : null}
      </section>

      <section className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <div className="label">Backfill</div>
            <p className="mt-1 text-xs text-slate-400">Log a window you forgot, or correct one.</p>
          </div>
          <button
            className="btn-ghost w-full sm:w-auto"
            onClick={() => setDrawer(drawer === 'log-previous' ? null : 'log-previous')}
          >
            {drawer === 'log-previous' ? 'Hide' : 'Log a previous window'}
          </button>
        </div>
        {drawer === 'log-previous' ? (
          <div className="mt-4">
            <WindowEditor
              defaultStartedAt={Date.now() - 6 * HOUR_MS}
              defaultEndedAt={Date.now() - HOUR_MS}
              requireEnd
              title="Log a previous eating window"
              submitLabel="Save window"
              onDone={() => setDrawer(null)}
              onCancel={() => setDrawer(null)}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Onboarding() {
  const upsertWindow = useFastStore(s => s.upsertWindow);
  const [mode, setMode] = useState<'fasting' | 'eating'>('eating');
  const [lastEnd, setLastEnd] = useState<string>(toLocalInputValue(Date.now() - 4 * HOUR_MS));
  const [windowStart, setWindowStart] = useState<string>(toLocalInputValue(Date.now() - HOUR_MS));

  async function onSave() {
    if (mode === 'fasting') {
      const endMs = fromLocalInputValue(lastEnd);
      if (Number.isNaN(endMs)) return;
      await upsertWindow({ startedAt: endMs - 30 * 60 * 1000, endedAt: endMs });
    } else {
      const startMs = fromLocalInputValue(windowStart);
      if (Number.isNaN(startMs)) return;
      await upsertWindow({ startedAt: startMs });
    }
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="label">Welcome</div>
        <h1 className="mt-1 font-display text-2xl">Set the clock.</h1>
        <p className="mt-2 text-sm text-slate-300">
          Tell it where you are right now — you can adjust either timestamp at any time.
        </p>
        <div className="mt-4 flex gap-2 text-sm">
          <button
            className={mode === 'eating' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setMode('eating')}
          >
            I'm eating now
          </button>
          <button
            className={mode === 'fasting' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setMode('fasting')}
          >
            I'm fasting now
          </button>
        </div>
        <div className="mt-4">
          {mode === 'eating' ? (
            <label className="block text-sm">
              <span className="label block mb-1">First meal of this window started at</span>
              <input
                type="datetime-local"
                value={windowStart}
                onChange={e => setWindowStart(e.target.value)}
                className="w-full max-w-md rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-base"
              />
              <p className="mt-2 text-xs text-slate-500">
                Tap "End eating" when you finish — that starts the fast clock.
              </p>
            </label>
          ) : (
            <label className="block text-sm">
              <span className="label block mb-1">Last meal ended at</span>
              <input
                type="datetime-local"
                value={lastEnd}
                onChange={e => setLastEnd(e.target.value)}
                className="w-full max-w-md rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-base"
              />
              <p className="mt-2 text-xs text-slate-500">Fast clock starts from here.</p>
            </label>
          )}
        </div>
        <div className="mt-4">
          <button className="btn-primary" onClick={() => void onSave()}>
            Set the clock
          </button>
        </div>
      </section>
    </div>
  );
}

interface PastWindowHistoryProps {
  windows: import('@/lib/db').EatingWindow[];
  settings: import('@/lib/db').UserSettings;
}

function PastWindowHistory({ windows, settings }: PastWindowHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  // Only closed windows, most-recent first
  const closed = [...windows]
    .filter(w => w.endedAt !== undefined)
    .sort((a, b) => b.startedAt - a.startedAt);

  if (closed.length === 0) return null;

  const visible = showAll ? closed : closed.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="label">Eating window history</div>
      {visible.map((w, i) => (
        <WindowMealCard
          key={w.id}
          window={w}
          weightLb={settings.weightLb}
          defaultOpen={i === 0}
        />
      ))}
      {closed.length > 3 && (
        <button
          className="w-full rounded-xl border border-slate-800 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
          onClick={() => setShowAll(v => !v)}
        >
          {showAll ? 'Show less' : `Show ${closed.length - 3} older windows`}
        </button>
      )}
    </div>
  );
}

function proteinTarget(weightLb?: number): string {
  if (!weightLb) return 'set weight in Settings';
  const lo = Math.round(weightLb * 0.7);
  const hi = Math.round(weightLb * 1.0);
  return `${lo}–${hi} g protein`;
}
