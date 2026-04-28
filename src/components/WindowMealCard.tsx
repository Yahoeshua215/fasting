import { useMemo, useState } from 'react';
import { getMealTotals, getMealProtein, getProteinTarget } from '@/lib/nutrition';
import { formatTimeOfDay } from '@/lib/time';
import { useFastStore } from '@/store/useFastStore';
import { MealLogger } from './MealLogger';
import { cn } from '@/lib/utils';
import type { EatingWindow } from '@/lib/db';

interface WindowMealCardProps {
  window: EatingWindow;
  weightLb?: number;
  /** Expand the meal log by default (used for the most recent window). */
  defaultOpen?: boolean;
}

function fmtDuration(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.round((ms % 3_600_000) / 60_000);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function MacroPill({ label, value, unit = 'g', accent = false }: {
  label: string;
  value: number;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      'flex flex-col items-center rounded-xl px-2 py-1.5 min-w-[52px]',
      accent ? 'bg-cyan-950/60 border border-cyan-800/40' : 'bg-slate-900/60',
    )}>
      <span className={cn('text-[11px] leading-none', accent ? 'text-cyan-400' : 'text-slate-500')}>
        {label}
      </span>
      <span className={cn('mt-0.5 font-display text-sm font-semibold tabular-nums', accent ? 'text-cyan-200' : 'text-slate-200')}>
        {Math.round(value)}{unit}
      </span>
    </div>
  );
}

export function WindowMealCard({ window: win, weightLb, defaultOpen = false }: WindowMealCardProps) {
  const [logOpen, setLogOpen] = useState(defaultOpen);
  const getMealsForWindow = useFastStore(s => s.getMealsForWindow);
  const foodItems = useFastStore(s => s.foodItems);
  const removeMeal = useFastStore(s => s.removeMeal);

  const meals = getMealsForWindow(win.id!);
  const foodById = useMemo(() => new Map(foodItems.map(f => [f.id!, f])), [foodItems]);
  const totals = getMealTotals(meals, foodById);
  const target = getProteinTarget(weightLb);
  const proteinPct = Math.min(1, totals.protein / target.max);
  const hasNutrition = totals.calories > 0;

  const durationMs = win.endedAt ? win.endedAt - win.startedAt : null;

  return (
    <div className="card">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="label">{fmtDate(win.startedAt)}</div>
          <div className="mt-0.5 text-sm text-slate-300">
            {formatTimeOfDay(win.startedAt)}
            {win.endedAt ? ` – ${formatTimeOfDay(win.endedAt)}` : ' · open'}
            {durationMs ? (
              <span className="ml-1.5 text-slate-500">· {fmtDuration(durationMs)}</span>
            ) : null}
          </div>
        </div>
        {win.endedAt && (
          <span className="pill shrink-0 self-start border-slate-700 text-slate-400">
            {fmtDuration(win.endedAt - win.startedAt)} window
          </span>
        )}
      </div>

      {/* ── Aggregate nutrition ── */}
      {hasNutrition ? (
        <div className="mt-3 space-y-2">
          {/* Protein bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Protein</span>
              <span className="tabular-nums text-slate-300">
                {Math.round(totals.protein)}g
                <span className="text-slate-500"> / {target.min}–{target.max}g goal</span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
                style={{ width: `${proteinPct * 100}%` }}
              />
            </div>
          </div>

          {/* Macro pills */}
          <div className="flex flex-wrap gap-1.5">
            <MacroPill label="Protein" value={totals.protein} accent />
            <MacroPill label="Fat" value={totals.fat} />
            <MacroPill label="Carbs" value={totals.carbs} />
            <MacroPill label="Fiber" value={totals.fiber} />
            <MacroPill label="Cal" value={totals.calories} unit="" />
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">No meals logged for this window.</p>
      )}

      {/* ── Condensed meal list (visible without expanding) ── */}
      {meals.length > 0 && !logOpen && (
        <div className="mt-3 space-y-1.5">
          {meals.map(meal => {
            const food = foodById.get(meal.foodItemId);
            if (!food) return null;
            const proteinG = getMealProtein(meal, food);
            return (
              <div key={meal.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/40 px-3 py-2">
                <div className="min-w-0">
                  <span className="text-sm text-slate-200 truncate block">{food.name}</span>
                  <span className="text-xs text-slate-500">
                    {meal.quantity > 1 ? `${meal.quantity}× ` : ''}{meal.measurementLabel}
                    {' · '}{Math.round(proteinG)}g protein
                  </span>
                </div>
                <button
                  className="shrink-0 text-xs text-slate-600 hover:text-rose-400 transition min-h-[36px] px-2"
                  onClick={() => void removeMeal(meal.id!)}
                  aria-label={`Remove ${food.name}`}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Toggle to expand full MealLogger ── */}
      <button
        className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition min-h-[40px]"
        onClick={() => setLogOpen(v => !v)}
      >
        <span className={cn('transition-transform', logOpen ? 'rotate-90' : '')} aria-hidden>▶</span>
        {logOpen
          ? 'Collapse meal log'
          : meals.length > 0
            ? `Edit / add to this window (${meals.length} logged)`
            : 'Log meals for this window'}
      </button>

      {/* ── Full MealLogger (edit + add) ── */}
      {logOpen && (
        <div className="mt-2 border-t border-slate-800 pt-4">
          <MealLogger windowId={win.id!} weightLb={weightLb} />
        </div>
      )}
    </div>
  );
}
