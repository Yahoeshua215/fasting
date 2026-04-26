import { useState } from 'react';
import {
  formatTimeOfDay,
  toLocalInputValue,
  fromLocalInputValue,
} from '@/lib/time';
import type { TrackerStatus } from '@/lib/state';

interface EatingWindowControlsProps {
  status: TrackerStatus;
  eatingHours?: number;
  onFirstMeal: (ts: number) => void | Promise<void>;
  onLastMeal: (ts: number) => void | Promise<void>;
}

export function EatingWindowControls({
  status,
  eatingHours,
  onFirstMeal,
  onLastMeal,
}: EatingWindowControlsProps) {
  const windowLabel = eatingHours ? `${eatingHours}h` : '';

  let firstRecorded: number | undefined;
  let lastRecorded: number | undefined;
  let firstNote: string;
  let lastNote: string;
  let firstCommitLabel: string;
  let lastCommitLabel: string;
  let firstHighlight: boolean;
  let lastHighlight: boolean;

  if (status.kind === 'eating') {
    firstRecorded = status.startedAt;
    lastRecorded = undefined;
    firstNote = 'Window start — tap ▾ to correct';
    lastNote = 'Tap when done eating';
    firstCommitLabel = 'Update';
    lastCommitLabel = 'End eating';
    firstHighlight = false;
    lastHighlight = true;

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <MealMarkerButton
          label="First meal started"
          recordedAt={firstRecorded}
          note={firstNote}
          commitLabel={firstCommitLabel}
          onCommit={onFirstMeal}
          highlight={firstHighlight}
        />
        <MealMarkerButton
          label="Last meal ended"
          recordedAt={lastRecorded}
          note={lastNote}
          commitLabel={lastCommitLabel}
          onCommit={onLastMeal}
          highlight={lastHighlight}
        />
      </div>
    );
  }

  if (status.kind === 'fasting') {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <MealMarkerButton
          label="Fast started"
          recordedAt={status.sinceMs}
          note="Tap ▾ to correct when your fast began"
          commitLabel="Correct"
          onCommit={onLastMeal}
          highlight={false}
        />
        <MealMarkerButton
          label="End fast"
          recordedAt={undefined}
          note={`Starts your ${windowLabel} eating window`}
          commitLabel="Start eating"
          onCommit={onFirstMeal}
          highlight={true}
        />
      </div>
    );
  }

  return null;
}

interface MealMarkerButtonProps {
  label: string;
  recordedAt?: number;
  note: string;
  commitLabel: string;
  onCommit: (ts: number) => void | Promise<void>;
  highlight: boolean;
}

function MealMarkerButton({
  label,
  recordedAt,
  note,
  commitLabel,
  onCommit,
  highlight,
}: MealMarkerButtonProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => toLocalInputValue(Date.now()));

  async function commitNow() {
    await onCommit(Date.now());
    setOpen(false);
  }

  async function commitAt() {
    const ts = fromLocalInputValue(value);
    if (!Number.isNaN(ts)) {
      await onCommit(ts);
      setOpen(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border p-3 sm:p-4 flex flex-col gap-2 transition ${
        highlight
          ? 'border-cyan-700/50 bg-slate-900/60'
          : 'border-slate-800/60 bg-slate-900/20'
      }`}
    >
      <div className="label text-[10px] sm:text-xs">{label}</div>

      <div className="font-display text-lg sm:text-xl tabular-nums text-white">
        {recordedAt !== undefined ? formatTimeOfDay(recordedAt) : '—'}
      </div>

      <p className="text-[11px] text-slate-400 leading-snug">{note}</p>

      <div className="flex items-stretch overflow-hidden rounded-xl mt-auto">
        <button
          className={
            highlight
              ? 'btn-primary flex-1 rounded-r-none text-sm'
              : 'btn-ghost flex-1 rounded-r-none text-sm'
          }
          onClick={() => void commitNow()}
        >
          <span className="flex flex-col items-center leading-tight sm:flex-row sm:gap-1.5">
            <span>{commitLabel}</span>
            <span className="text-[10px] sm:text-xs opacity-60">{formatTimeOfDay(Date.now())}</span>
          </span>
        </button>
        <button
          className={
            highlight
              ? 'btn-primary rounded-l-none border-l border-cyan-700/40 px-3 min-w-[44px]'
              : 'btn-ghost rounded-l-none border-l border-slate-700 px-3 min-w-[44px]'
          }
          onClick={() => {
            setValue(toLocalInputValue(Date.now()));
            setOpen(o => !o);
          }}
          aria-label="Set custom time"
          title="Pick a specific time"
        >
          ▾
        </button>
      </div>

      {open ? (
        <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
          <input
            type="datetime-local"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 text-base"
          />
          <div className="flex gap-2">
            <button className="btn-primary flex-1 text-sm" onClick={() => void commitAt()}>
              Save
            </button>
            <button
              className="btn-ghost flex-1 text-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
