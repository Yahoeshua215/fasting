import type { EatingWindow, FoodItem, MealEntry } from './db';
import { getMealTotals } from './nutrition';

export type RangeKey = '7d' | '30d' | '90d';

export interface DayStats {
  /** Display label, e.g. "Apr 25" */
  label: string;
  /** ISO date string, e.g. "2026-04-25" */
  isoDate: string;
  /** Hours fasted before this eating window opened (null = no data) */
  fastHours: number | null;
  /** Duration of eating window in hours (null = window still open or no data) */
  eatHours: number | null;
  /** Hour-of-day the eating window started (0–24 float, null = no data) */
  eatStartHour: number | null;
  /** Hour-of-day the eating window ended (0–24 float, null = no data) */
  eatEndHour: number | null;
  /** Whether the fast hit the 18-hour target */
  hitTarget: boolean;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  fiber: number;
}

function startOfDayMs(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function isoDate(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function shortLabel(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function msToHours(ms: number): number {
  return Math.round((ms / 3_600_000) * 10) / 10;
}

function hourOfDay(ts: number): number {
  const d = new Date(ts);
  return Math.round((d.getHours() + d.getMinutes() / 60) * 10) / 10;
}

/**
 * Build a day-by-day stats array for the given range.
 *
 * The eating window is attributed to the day it *started*.
 * Meal entries are attributed to the day their eating window started.
 */
export function buildDayStats(
  windows: EatingWindow[],
  mealEntries: MealEntry[],
  foodById: Map<number, FoodItem>,
  range: RangeKey,
): DayStats[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const now = Date.now();
  const cutoff = now - days * 86_400_000;

  // Build a map from isoDate → day-stats skeleton
  const statsMap = new Map<string, DayStats>();
  for (let i = 0; i < days; i++) {
    const ts = startOfDayMs(now - i * 86_400_000);
    const iso = isoDate(ts);
    statsMap.set(iso, {
      label: shortLabel(ts),
      isoDate: iso,
      fastHours: null,
      eatHours: null,
      eatStartHour: null,
      eatEndHour: null,
      hitTarget: false,
      protein: 0,
      fat: 0,
      carbs: 0,
      calories: 0,
      fiber: 0,
    });
  }

  // Sort windows oldest-first so we can calculate fast gap from previous window
  const sortedWindows = [...windows]
    .filter(w => w.startedAt >= cutoff - 86_400_000 * 2) // include a 2-day buffer for fasts
    .sort((a, b) => a.startedAt - b.startedAt);

  for (let i = 0; i < sortedWindows.length; i++) {
    const w = sortedWindows[i];
    const day = statsMap.get(isoDate(w.startedAt));
    if (!day) continue;

    // Eating window duration
    if (w.endedAt) {
      day.eatHours = msToHours(w.endedAt - w.startedAt);
    }

    day.eatStartHour = hourOfDay(w.startedAt);
    if (w.endedAt) day.eatEndHour = hourOfDay(w.endedAt);

    // Fast duration = gap from previous window's endedAt to this window's startedAt
    const prev = sortedWindows[i - 1];
    if (prev?.endedAt) {
      const fastMs = w.startedAt - prev.endedAt;
      if (fastMs > 0) {
        day.fastHours = msToHours(fastMs);
        day.hitTarget = fastMs >= 18 * 3_600_000;
      }
    }
  }

  // Build a lookup from windowId → eating window so we can attribute meals
  // to the day the eating window *started*, not the day the meal was added.
  // This prevents retroactively-logged meals from appearing on today's date.
  const windowDateById = new Map<number, string>();
  for (const w of windows) {
    if (w.id != null) windowDateById.set(w.id, isoDate(w.startedAt));
  }

  // Aggregate meal nutrition by eating-window date
  const mealsByDay = new Map<string, MealEntry[]>();
  for (const m of mealEntries) {
    const key = windowDateById.get(m.windowId) ?? isoDate(m.loggedAt);
    if (!statsMap.has(key)) continue; // outside the selected range
    if (!mealsByDay.has(key)) mealsByDay.set(key, []);
    mealsByDay.get(key)!.push(m);
  }

  for (const [iso, entries] of mealsByDay) {
    const day = statsMap.get(iso);
    if (!day) continue;
    const totals = getMealTotals(entries, foodById);
    day.protein = Math.round(totals.protein);
    day.fat = Math.round(totals.fat);
    day.carbs = Math.round(totals.carbs);
    day.calories = Math.round(totals.calories);
    day.fiber = Math.round(totals.fiber);
  }

  // Return sorted oldest→newest so charts read left-to-right
  return [...statsMap.values()].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

/** Weekly rollups for the "weekly" aggregate view. */
export interface WeekStats {
  weekLabel: string;
  avgFastHours: number | null;
  avgEatHours: number | null;
  daysHitTarget: number;
  totalDays: number;
  avgProtein: number;
  avgCalories: number;
}

export function buildWeekStats(days: DayStats[]): WeekStats[] {
  const weeks: WeekStats[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const chunk = days.slice(i, i + 7);
    const fastDays = chunk.filter(d => d.fastHours !== null);
    const eatDays = chunk.filter(d => d.eatHours !== null);
    const nutritionDays = chunk.filter(d => d.calories > 0);

    const firstLabel = chunk[0]?.label ?? '';
    const lastLabel = chunk[chunk.length - 1]?.label ?? '';

    weeks.push({
      weekLabel: firstLabel === lastLabel ? firstLabel : `${firstLabel}–${lastLabel}`,
      avgFastHours:
        fastDays.length > 0
          ? Math.round((fastDays.reduce((s, d) => s + d.fastHours!, 0) / fastDays.length) * 10) / 10
          : null,
      avgEatHours:
        eatDays.length > 0
          ? Math.round((eatDays.reduce((s, d) => s + d.eatHours!, 0) / eatDays.length) * 10) / 10
          : null,
      daysHitTarget: chunk.filter(d => d.hitTarget).length,
      totalDays: chunk.length,
      avgProtein:
        nutritionDays.length > 0
          ? Math.round(nutritionDays.reduce((s, d) => s + d.protein, 0) / nutritionDays.length)
          : 0,
      avgCalories:
        nutritionDays.length > 0
          ? Math.round(nutritionDays.reduce((s, d) => s + d.calories, 0) / nutritionDays.length)
          : 0,
    });
  }
  return weeks;
}
