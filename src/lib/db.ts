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
        // Remove old built-in seeds (they lack per100g / grams data).
        await foodItems.filter(f => Boolean(f.builtIn)).delete();
        // Insert the full USDA catalog.
        await foodItems.bulkAdd(USDA_FOODS.map(usdaToFoodItem));
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
