import { useEffect, useMemo, useRef, useState } from 'react';
import { formatTimeOfDay } from '@/lib/time';
import { estimateMacros } from '@/lib/openai';
import { getMealTotals, getMealProtein, getProteinTarget } from '@/lib/nutrition';
import { useFastStore } from '@/store/useFastStore';
import { FoodSearch } from './FoodSearch';
import type { FoodItem } from '@/lib/db';

/**
 * Numeric input that lets the user freely edit (including clearing the field)
 * and only commits to the store on blur — avoiding the "can't delete a digit"
 * problem that arises when a numeric controlled input rejects empty string.
 */
function QuantityInput({
  value,
  onCommit,
  className,
}: {
  value: number;
  onCommit: (next: number) => void;
  className?: string;
}) {
  const [local, setLocal] = useState(String(value));
  const lastCommitted = useRef(value);

  // Keep display in sync if the external value changes (e.g. after a save).
  useEffect(() => {
    if (value !== lastCommitted.current) {
      setLocal(String(value));
      lastCommitted.current = value;
    }
  }, [value]);

  function handleBlur() {
    const parsed = parseFloat(local);
    if (!Number.isNaN(parsed) && parsed > 0) {
      lastCommitted.current = parsed;
      onCommit(parsed);
    } else {
      // Reset to last valid value
      setLocal(String(lastCommitted.current));
    }
  }

  return (
    <input
      type="number"
      min="0.25"
      step="0.25"
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={handleBlur}
      className={className}
    />
  );
}

interface MealLoggerProps {
  windowId: number;
  weightLb?: number;
}

export function MealLogger({ windowId, weightLb }: MealLoggerProps) {
  const foodItems = useFastStore(s => s.foodItems);
  const getMealsForWindow = useFastStore(s => s.getMealsForWindow);
  const addFoodItem = useFastStore(s => s.addFoodItem);
  const logMeal = useFastStore(s => s.logMeal);
  const updateMealEntry = useFastStore(s => s.updateMealEntry);
  const removeMeal = useFastStore(s => s.removeMeal);

  // Pending food picked from search, awaiting measurement confirmation.
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null);
  const [pendingMeasurement, setPendingMeasurement] = useState('');
  const [pendingQty, setPendingQty] = useState(1);

  const [addingCustom, setAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meals = getMealsForWindow(windowId);
  const foodById = useMemo(() => new Map(foodItems.map(f => [f.id!, f])), [foodItems]);
  const totals = getMealTotals(meals, foodById);
  const proteinTarget = getProteinTarget(weightLb);
  const proteinProgress = Math.min(1, totals.protein / proteinTarget.max);

  // IDs in reverse-chronological order for "recent" quick picks.
  const recentFoodIds = useMemo(() => {
    const seen = new Set<number>();
    const ids: number[] = [];
    for (const m of [...meals].reverse()) {
      if (!seen.has(m.foodItemId)) {
        seen.add(m.foodItemId);
        ids.push(m.foodItemId);
      }
    }
    return ids;
  }, [meals]);

  function handleFoodSelected(food: FoodItem) {
    const defaultMeasurement =
      food.measurementOptions?.find(m =>
        food.servingLabel ? m.label === food.servingLabel : false,
      ) ??
      food.measurementOptions?.[0];
    setPendingFood(food);
    setPendingMeasurement(defaultMeasurement?.label ?? food.servingLabel);
    setPendingQty(1);
  }

  async function handleConfirmLog() {
    if (!pendingFood) return;
    await logMeal(windowId, pendingFood.id!, pendingQty, pendingMeasurement);
    setPendingFood(null);
  }

  async function handleAddCustom() {
    const description = customInput.trim();
    if (!description) return;
    setSubmitting(true);
    setError(null);
    try {
      const estimate = await estimateMacros(description);
      const foodId = await addFoodItem(estimate);
      const newFood = foodItems.find(f => f.id === foodId);
      if (newFood) {
        handleFoodSelected(newFood);
      } else {
        await logMeal(windowId, foodId, 1);
      }
      setCustomInput('');
      setAddingCustom(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to estimate that food right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <div className="label">Meals this window</div>
      <h2 className="mt-1 font-display text-lg sm:text-xl">Log what you ate</h2>

      {/* ── Nutrition tally ── */}
      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-200 font-medium">Protein</span>
          <span className="text-slate-300 tabular-nums">
            {Math.round(totals.protein)}g / {proteinTarget.min}–{proteinTarget.max}g
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
            style={{ width: `${proteinProgress * 100}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>Fat {Math.round(totals.fat)}g</span>
          <span>Carbs {Math.round(totals.carbs)}g</span>
          <span>Fiber {Math.round(totals.fiber)}g</span>
          <span>Calories {Math.round(totals.calories)}</span>
        </div>
      </div>

      {/* ── Food search ── */}
      <div className="mt-4">
        <FoodSearch
          foodItems={foodItems}
          recentFoodIds={recentFoodIds}
          onSelect={handleFoodSelected}
        />
      </div>

      {/* ── Measurement confirmation after search pick ── */}
      {pendingFood && (
        <div className="mt-3 rounded-xl border border-cyan-700/40 bg-slate-950/60 p-3 space-y-2">
          <div className="text-sm font-medium text-slate-100">{pendingFood.name}</div>
          <div className="grid gap-2 sm:grid-cols-[100px_1fr]">
            <div>
              <div className="label mb-1">Quantity</div>
              <QuantityInput
                value={pendingQty}
                onCommit={setPendingQty}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-base"
              />
            </div>
            <div>
              <div className="label mb-1">Serving size</div>
              <select
                value={pendingMeasurement}
                onChange={e => setPendingMeasurement(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-base"
              >
                {(pendingFood.measurementOptions?.length
                  ? pendingFood.measurementOptions
                  : [{ label: pendingFood.servingLabel, multiplier: 1 }]
                ).map(opt => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={() => void handleConfirmLog()}>
              Log it
            </button>
            <button className="btn-ghost flex-1" onClick={() => setPendingFood(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Add custom via AI ── */}
      <div className="mt-3">
        <button
          className="text-xs text-slate-400 hover:text-slate-200 min-h-[44px] flex items-center gap-1"
          onClick={() => setAddingCustom(v => !v)}
        >
          + Add custom food with AI estimate
        </button>
        {addingCustom && (
          <div className="mt-2 space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <label className="block text-sm">
              <span className="label block mb-1">Describe the food</span>
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="e.g. two scrambled eggs with spinach and feta"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-base"
              />
            </label>
            <div className="flex gap-2">
              <button
                className="btn-primary flex-1"
                disabled={submitting}
                onClick={() => void handleAddCustom()}
              >
                {submitting ? 'Estimating…' : 'Estimate & add'}
              </button>
              <button className="btn-ghost flex-1" onClick={() => setAddingCustom(false)}>
                Cancel
              </button>
            </div>
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>
        )}
      </div>

      {/* ── Logged meals list ── */}
      <div className="mt-4 space-y-2">
        <div className="label">Logged</div>
        {meals.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing logged yet — search above to add.</p>
        ) : (
          meals.map(meal => {
            const food = foodById.get(meal.foodItemId);
            if (!food) return null;
            const proteinG = getMealProtein(meal, food);
            return (
              <div
                key={meal.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-100">{food.name}</div>
                    <div className="text-xs text-slate-500">{formatTimeOfDay(meal.loggedAt)}</div>
                  </div>
                  <button
                    className="btn-ghost shrink-0 px-3 py-1.5 text-xs"
                    onClick={() => void removeMeal(meal.id!)}
                    aria-label={`Remove ${food.name}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-[100px_1fr]">
                  <QuantityInput
                    value={meal.quantity}
                    onCommit={v => void updateMealEntry(meal.id!, { quantity: v })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  />
                  <select
                    value={meal.measurementLabel}
                    onChange={e => void updateMealEntry(meal.id!, { measurementLabel: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  >
                    {(food.measurementOptions?.length
                      ? food.measurementOptions
                      : [{ label: food.servingLabel, multiplier: 1 }]
                    ).map(opt => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-1.5 text-xs text-slate-500">
                  {Math.round(proteinG)}g protein · {Math.round(food.calories * (meal.quantity || 1) * (food.measurementOptions?.find(m => m.label === meal.measurementLabel)?.multiplier ?? 1))} cal
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
