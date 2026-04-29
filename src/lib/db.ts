import Dexie, { type Table } from 'dexie';
import type { ProtocolId } from './protocols';
import { USDA_FOODS, usdaToFoodItem } from './foodDb';

/**
 * An eating window — bounded by the first bite of the first meal (`startedAt`)
 * and the last bite of the last meal (`endedAt`). May contain multiple meals;
 * we don't track individual meals yet (Phase 2). The fast clock is the gap
 * between one window's `endedAt` and the next window's `startedAt`.
 */
export interface EatingWindow {
  id?: number;
  startedAt: number;
  endedAt?: number;
  notes?: string;
}

export interface UserSettings {
  id: 'singleton';
  sex?: 'male' | 'female' | 'other';
  weightLb?: number;
  defaultProtocol?: ProtocolId;
  workoutLeadHours?: number;
  supervisionConfirmedAt?: number;
}

export interface Per100g {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
}

export interface MeasurementOption {
  label: string;
  /** Legacy multiplier relative to the default serving. */
  multiplier: number;
  /** Actual gram weight for this serving size (used with per100g). */
  grams?: number;
}

export interface FoodItem {
  id?: number;
  name: string;
  servingLabel: string;
  measurementOptions?: MeasurementOption[];
  /** USDA-sourced per-100g macros — preferred for calculation when present. */
  per100g?: Per100g;
  /** Pre-computed per default-serving macros (kept for display + legacy compat). */
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  builtIn?: boolean;
  source?: 'usda' | 'user';
}

export interface MealEntry {
  id?: number;
  windowId: number;
  foodItemId: number;
  quantity: number;
  measurementLabel: string;
  loggedAt: number;
}

class FastingDB extends Dexie {
  windows!: Table<EatingWindow, number>;
  settings!: Table<UserSettings, string>;
  foodItems!: Table<FoodItem, number>;
  mealEntries!: Table<MealEntry, number>;

  constructor() {
    super('fasting-app');
    this.version(1).stores({
      sessions: '++id, protocolId, startAt, actualEndAt',
      settings: 'id',
    });
    this.version(2).stores({
      sessions: null,
      meals: '++id, startedAt, endedAt',
      settings: 'id',
    });
    this.version(3)
      .stores({
        meals: null,
        windows: '++id, startedAt, endedAt',
        settings: 'id',
      })
      .upgrade(async tx => {
        const oldTable = tx.table<EatingWindow>('meals');
        const rows = await oldTable.toArray();
        if (rows.length) {
          await tx.table<EatingWindow>('windows').bulkAdd(rows);
        }
      });
    this.version(4)
      .stores({
        windows: '++id, startedAt, endedAt',
        settings: 'id',
        foodItems: '++id, name',
        mealEntries: '++id, windowId, foodItemId, loggedAt',
      });
    this.version(5)
      .stores({
        windows: '++id, startedAt, endedAt',
        settings: 'id',
        foodItems: '++id, name',
        mealEntries: '++id, windowId, foodItemId, loggedAt',
      })
      .upgrade(async tx => {
        const meals = tx.table<MealEntry>('mealEntries');
        const foods = await tx.table<FoodItem>('foodItems').toArray();
        const rows = await meals.toArray();
        for (const row of rows) {
          const food = foods.find(f => f.id === row.foodItemId);
          const defaultLabel =
            food?.measurementOptions?.[0]?.label ?? food?.servingLabel ?? 'serving';
          await meals.update(row.id!, {
            quantity: (row as MealEntry & { servings?: number }).quantity
              ?? (row as MealEntry & { servings?: number }).servings
              ?? 1,
            measurementLabel: row.measurementLabel ?? defaultLabel,
          });
        }
      });
    // v6: replace all builtIn foods with the USDA-sourced catalog.
    // User-created foods (source !== 'usda', builtIn falsy) are preserved.
    this.version(6)
      .stores({
        windows: '++id, startedAt, endedAt',
        settings: 'id',
        foodItems: '++id, name, source',
        mealEntries: '++id, windowId, foodItemId, loggedAt',
      })
      .upgrade(async tx => {
        const foodItems = tx.table<FoodItem>('foodItems');
        await foodItems.filter(f => Boolean(f.builtIn)).delete();
        await foodItems.bulkAdd(USDA_FOODS.map(usdaToFoodItem));
      });
    // v7: refresh the built-in catalog — upsert by name to preserve IDs so
    // existing meal entries keep working.
    this.version(7)
      .stores({
        windows: '++id, startedAt, endedAt',
        settings: 'id',
        foodItems: '++id, name, source',
        mealEntries: '++id, windowId, foodItemId, loggedAt',
      })
      .upgrade(async tx => {
        const foodItems = tx.table<FoodItem>('foodItems');
        const existing = await foodItems.filter(f => f.source === 'usda').toArray();
        const byName = new Map(existing.map(f => [f.name, f.id!]));
        for (const food of USDA_FOODS.map(usdaToFoodItem)) {
          const existingId = byName.get(food.name);
          if (existingId !== undefined) {
            await foodItems.update(existingId, food);
          } else {
            await foodItems.add(food);
          }
        }
      });
    // v8: recover meal entries broken by an earlier v7 that used delete+reinsert.
    // Infers the original food name from the sequential bulk-insert ordering of v6,
    // then re-points the foodItemId at the current food with that name.
    this.version(8)
      .stores({
        windows: '++id, startedAt, endedAt',
        settings: 'id',
        foodItems: '++id, name, source',
        mealEntries: '++id, windowId, foodItemId, loggedAt',
      })
      .upgrade(async tx => {
        const foodItems = tx.table<FoodItem>('foodItems');
        const mealEntries = tx.table<MealEntry>('mealEntries');

        const allFoods = await foodItems.toArray();
        const currentIds = new Set(allFoods.map(f => f.id!));
        const nameToId = new Map(allFoods.map(f => [f.name, f.id!]));

        const allMeals = await mealEntries.toArray();
        const orphaned = allMeals.filter(m => !currentIds.has(m.foodItemId));
        if (orphaned.length === 0) return;

        // The v6 USDA seed was a single bulkAdd — IDs are contiguous.
        // The minimum orphaned ID is where that seed started.
        const orphanedIds = [...new Set(orphaned.map(m => m.foodItemId))].sort((a, b) => a - b);
        const startId = orphanedIds[0];

        for (const meal of orphaned) {
          const index = meal.foodItemId - startId;
          if (index >= 0 && index < USDA_FOODS.length) {
            const newId = nameToId.get(USDA_FOODS[index].name);
            if (newId !== undefined) {
              await mealEntries.update(meal.id!, { foodItemId: newId });
            }
          }
        }
      });
    // v9: clear corrupted meal entries from broken v7/v8 migrations.
    this.version(9)
      .stores({
        windows: '++id, startedAt, endedAt',
        settings: 'id',
        foodItems: '++id, name, source',
        mealEntries: '++id, windowId, foodItemId, loggedAt',
      })
      .upgrade(async tx => {
        await tx.table('mealEntries').clear();
      });
  }
}

export const db = new FastingDB();

export async function getOpenWindow(): Promise<EatingWindow | undefined> {
  return db.windows.filter(w => w.endedAt === undefined).first();
}

export async function getRecentWindows(limit = 50): Promise<EatingWindow[]> {
  return db.windows.orderBy('startedAt').reverse().limit(limit).toArray();
}

export async function getLatestWindow(): Promise<EatingWindow | undefined> {
  return db.windows.orderBy('startedAt').reverse().first();
}

export async function getSettings(): Promise<UserSettings> {
  const s = await db.settings.get('singleton');
  return s ?? { id: 'singleton' };
}

export async function saveSettings(patch: Partial<UserSettings>): Promise<void> {
  const existing = await getSettings();
  await db.settings.put({ ...existing, ...patch, id: 'singleton' });
}

export async function getFoodItems(): Promise<FoodItem[]> {
  return db.foodItems.orderBy('name').toArray();
}

export async function getMealEntries(limit = 200): Promise<MealEntry[]> {
  return db.mealEntries.orderBy('loggedAt').reverse().limit(limit).toArray();
}
