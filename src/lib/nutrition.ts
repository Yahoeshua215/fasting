import type { FoodItem, MealEntry } from './db';

export const DEFAULT_WEIGHT_LB = 180;

export interface ProteinTarget {
  min: number;
  max: number;
}

export function getProteinTarget(weightLb?: number): ProteinTarget {
  const weight = weightLb && weightLb > 0 ? weightLb : DEFAULT_WEIGHT_LB;
  return {
    min: Math.round(weight * 0.7),
    max: Math.round(weight * 1.0),
  };
}

export interface MacroTotals {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  fiber: number;
}

/**
 * Compute the effective multiplier for a meal entry.
 *
 * Priority:
 * 1. If the food has per100g data AND the selected measurement has a gram
 *    weight → use (quantity * grams) / 100 as the scaling factor against per100g.
 * 2. Otherwise fall back to quantity × multiplier × per-serving macros.
 */
export function getMealFactor(
  meal: MealEntry,
  food: FoodItem,
): { factor: number; usesPer100g: boolean } {
  const measurement = food.measurementOptions?.find(m => m.label === meal.measurementLabel)
    ?? food.measurementOptions?.[0];

  if (food.per100g && measurement?.grams != null) {
    return {
      factor: (meal.quantity * measurement.grams) / 100,
      usesPer100g: true,
    };
  }

  return {
    factor: meal.quantity * (measurement?.multiplier ?? 1),
    usesPer100g: false,
  };
}

export function getMealTotals(
  mealEntries: MealEntry[],
  foodById: Map<number, FoodItem>,
): MacroTotals {
  return mealEntries.reduce(
    (acc, meal) => {
      const food = foodById.get(meal.foodItemId);
      if (!food) return acc;

      const { factor, usesPer100g } = getMealFactor(meal, food);

      if (usesPer100g && food.per100g) {
        acc.protein += food.per100g.protein * factor;
        acc.fat += food.per100g.fat * factor;
        acc.carbs += food.per100g.carbs * factor;
        acc.calories += food.per100g.calories * factor;
        acc.fiber += (food.per100g.fiber ?? 0) * factor;
      } else {
        acc.protein += food.protein * factor;
        acc.fat += food.fat * factor;
        acc.carbs += food.carbs * factor;
        acc.calories += food.calories * factor;
      }
      return acc;
    },
    { protein: 0, fat: 0, carbs: 0, calories: 0, fiber: 0 },
  );
}

/** Per-meal protein grams, respecting per100g when available. */
export function getMealProtein(meal: MealEntry, food: FoodItem): number {
  const { factor, usesPer100g } = getMealFactor(meal, food);
  return (usesPer100g && food.per100g ? food.per100g.protein : food.protein) * factor;
}
