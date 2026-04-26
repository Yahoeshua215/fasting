import { useState } from 'react';
import { fromLocalInputValue, toLocalInputValue, formatTimeOfDay } from '@/lib/time';

interface TimestampActionProps {
  label: string;
  /** Called with the chosen timestamp (defaults to "now"). */
  onCommit: (ts: number) => void | Promise<void>;
  /** Default when "now" is not appropriate (e.g. last meal ended hours ago). */
  defaultTs?: number;
  primary?: boolean;
  /** Render as visible-but-inactive (e.g. "this action doesn't apply right now"). */
  disabled?: boolean;
  disabledHint?: string;
}

/**
 * A one-tap button that commits an action at "now" — but with a chevron that
 * reveals a datetime picker so you can override the timestamp before committing.
 */
export function TimestampAction({
  label,
  onCommit,
  defaultTs,
  primary = true,
  disabled = false,
  disabledHint,
}: TimestampActionProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(toLocalInputValue(defaultTs ?? Date.now()));

  async function commitNow() {
    if (disabled) return;
    await onCommit(Date.now());
  }
  async function commitAt() {
    if (disabled) return;
    const ts = fromLocalInputValue(value);
    if (Number.isNaN(ts)) return;
    await onCommit(ts);
    setOpen(false);
  }

  if (disabled) {
    return (
      <div className="flex flex-col gap-1">
        <button
          className="btn-ghost cursor-not-allowed border-dashed text-slate-500 opacity-60"
          disabled
          title={disabledHint}
        >
          {label}
        </button>
        {disabledHint ? <span className="text-[11px] text-slate-500">{disabledHint}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-1.5">
      <div className="flex items-stretch overflow-hidden rounded-xl">
        <button
          className={
            primary
              ? 'btn-primary rounded-r-none px-4'
              : 'btn-ghost rounded-r-none px-4'
          }
          onClick={() => void commitNow()}
        >
          {label}
          <span className="ml-2 text-xs opacity-70">{formatTimeOfDay(Date.now())}</span>
        </button>
        <button
          className={
            primary
              ? 'btn-primary rounded-l-none border-l border-cyan-700/40 px-2'
              : 'btn-ghost rounded-l-none border-l border-slate-700 px-2'
          }
          aria-label="Adjust timestamp"
          onClick={() => setOpen(o => !o)}
        >
          ▾
        </button>
      </div>
      {open ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2">
          <input
            type="datetime-local"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-sm"
          />
          <button className="btn-primary px-3 py-1 text-xs" onClick={() => void commitAt()}>
            Save
          </button>
          <button
            className="text-xs text-slate-400 hover:text-slate-200"
            onClick={() => setOpen(false)}
          >
            cancel
          </button>
        </div>
      ) : null}
    </div>
  );
}
