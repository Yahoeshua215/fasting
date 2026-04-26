import { useState } from 'react';
import { useFastStore } from '@/store/useFastStore';
import { fromLocalInputValue, toLocalInputValue } from '@/lib/time';
import type { EatingWindow } from '@/lib/db';

interface WindowEditorProps {
  window?: EatingWindow;
  defaultStartedAt?: number;
  defaultEndedAt?: number;
  /** Whether the "last meal ended at" field is required. */
  requireEnd?: boolean;
  title?: string;
  submitLabel?: string;
  onDone?: () => void;
  onCancel?: () => void;
}

export function WindowEditor({
  window,
  defaultStartedAt,
  defaultEndedAt,
  requireEnd = false,
  title,
  submitLabel = 'Save',
  onDone,
  onCancel,
}: WindowEditorProps) {
  const upsertWindow = useFastStore(s => s.upsertWindow);
  const deleteWindow = useFastStore(s => s.deleteWindow);

  const [startedAt, setStartedAt] = useState<string>(
    toLocalInputValue(window?.startedAt ?? defaultStartedAt ?? Date.now()),
  );
  const [endedAt, setEndedAt] = useState<string>(
    window?.endedAt !== undefined
      ? toLocalInputValue(window.endedAt)
      : defaultEndedAt !== undefined
        ? toLocalInputValue(defaultEndedAt)
        : '',
  );
  const [notes, setNotes] = useState<string>(window?.notes ?? '');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    const start = fromLocalInputValue(startedAt);
    if (Number.isNaN(start)) {
      setError('Pick a valid first-meal time.');
      return;
    }
    let end: number | undefined;
    if (endedAt) {
      end = fromLocalInputValue(endedAt);
      if (Number.isNaN(end)) {
        setError('Pick a valid last-meal time.');
        return;
      }
      if (end < start) {
        setError("Last meal can't be before the first meal.");
        return;
      }
    } else if (requireEnd) {
      setError('This window needs a last-meal time.');
      return;
    }
    await upsertWindow({
      id: window?.id,
      startedAt: start,
      endedAt: end,
      notes: notes.trim() || undefined,
    });
    onDone?.();
  }

  async function onDelete() {
    if (!window?.id) return;
    if (!confirm('Delete this eating window?')) return;
    await deleteWindow(window.id);
    onDone?.();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
      {title ? <div className="font-display text-sm text-slate-200">{title}</div> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="label block mb-1">First meal started</span>
          <input
            type="datetime-local"
            value={startedAt}
            onChange={e => setStartedAt(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-base"
          />
        </label>
        <label className="text-sm">
          <span className="label block mb-1">
            Last meal ended {requireEnd ? '' : <span className="text-slate-500">(blank = still eating)</span>}
          </span>
          <input
            type="datetime-local"
            value={endedAt}
            onChange={e => setEndedAt(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-base"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="label block mb-1">Notes</span>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="optional"
          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-base"
        />
      </label>
      {error ? <div className="text-xs text-rose-300">{error}</div> : null}
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={() => void onSubmit()}>
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        {window?.id ? (
          <button className="btn-danger ml-auto" onClick={() => void onDelete()}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
