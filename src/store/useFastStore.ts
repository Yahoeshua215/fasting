import { create } from 'zustand';
import {
  db,
  getRecentWindows,
  getSettings,
  getFoodItems,
  getMealEntries,
  saveSettings,
  type EatingWindow,
  type FoodItem,
  type MealEntry,
  type UserSettings,
} from '@/lib/db';

interface FastState {
  windows: EatingWindow[];
  foodItems: FoodItem[];
  mealEntries: MealEntry[];
  settings: UserSettings;
  loading: boolean;
  hydrate: () => Promise<void>;
  /** Open a new eating window. Defaults to "now" but accepts an override timestamp. */
  openWindow: (startedAt?: number) => Promise<void>;
  /** Close the open eating window. Defaults to "now" but accepts an override timestamp. */
  closeWindow: (endedAt?: number) => Promise<void>;
  upsertWindow: (
    w: Partial<EatingWindow> & { startedAt: number },
  ) => Promise<number>;
  updateWindow: (id: number, patch: Partial<EatingWindow>) => Promise<void>;
  deleteWindow: (id: number) => Promise<void>;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => Promise<number>;
  logMeal: (windowId: number, foodItemId: number, quantity?: number, measurementLabel?: string, loggedAt?: number) => Promise<void>;
  updateMealEntry: (mealEntryId: number, patch: Partial<MealEntry>) => Promise<void>;
  removeMeal: (mealEntryId: number) => Promise<void>;
  getMealsForWindow: (windowId: number) => MealEntry[];
  patchSettings: (patch: Partial<UserSettings>) => Promise<void>;
}

async function refreshWindows(): Promise<EatingWindow[]> {
  const list = await getRecentWindows(50);
  return list.sort((a, b) => a.startedAt - b.startedAt);
}

export const useFastStore = create<FastState>((set, get) => ({
  windows: [],
  foodItems: [],
  mealEntries: [],
  settings: { id: 'singleton' },
  loading: true,

  async hydrate() {
    const [windows, settings, foodItems, mealEntries] = await Promise.all([
      refreshWindows(),
      getSettings(),
      getFoodItems(),
      getMealEntries(),
    ]);
    set({ windows, settings, foodItems, mealEntries, loading: false });
  },

  async openWindow(startedAt) {
    const all = get().windows;
    const latest = all[all.length - 1];
    // Only block if the *latest* window is still open — stale open windows from
    // migration shouldn't prevent starting a new eating session.
    if (latest && latest.endedAt === undefined) return;
    await db.windows.add({ startedAt: startedAt ?? Date.now() });
    set({ windows: await refreshWindows() });
  },

  async closeWindow(endedAt) {
    const open = get().windows.find(w => w.endedAt === undefined);
    if (!open?.id) return;
    await db.windows.update(open.id, { endedAt: endedAt ?? Date.now() });
    set({ windows: await refreshWindows() });
  },

  async upsertWindow(w) {
    const id =
      w.id ??
      (await db.windows.add({
        startedAt: w.startedAt,
        endedAt: w.endedAt,
        notes: w.notes,
      }));
    if (w.id !== undefined) {
      await db.windows.update(w.id, {
        startedAt: w.startedAt,
        endedAt: w.endedAt,
        notes: w.notes,
      });
    }
    set({ windows: await refreshWindows() });
    return id;
  },

  async updateWindow(id, patch) {
    await db.windows.update(id, patch);
    set({ windows: await refreshWindows() });
  },

  async deleteWindow(id) {
    await db.windows.delete(id);
    set({ windows: await refreshWindows() });
  },

  async addFoodItem(item) {
    const id = await db.foodItems.add(item);
    set({ foodItems: await getFoodItems() });
    return id;
  },

  async logMeal(windowId, foodItemId, quantity = 1, measurementLabel, loggedAt = Date.now()) {
    const food = get().foodItems.find(f => f.id === foodItemId);
    const fallbackMeasurement =
      measurementLabel
      ?? food?.measurementOptions?.[0]?.label
      ?? food?.servingLabel
      ?? 'serving';
    await db.mealEntries.add({
      windowId,
      foodItemId,
      quantity,
      measurementLabel: fallbackMeasurement,
      loggedAt,
    });
    set({ mealEntries: await getMealEntries() });
  },

  async updateMealEntry(mealEntryId, patch) {
    await db.mealEntries.update(mealEntryId, patch);
    set({ mealEntries: await getMealEntries() });
  },

  async removeMeal(mealEntryId) {
    await db.mealEntries.delete(mealEntryId);
    set({ mealEntries: await getMealEntries() });
  },

  getMealsForWindow(windowId) {
    return get()
      .mealEntries.filter(m => m.windowId === windowId)
      .sort((a, b) => a.loggedAt - b.loggedAt);
  },

  async patchSettings(patch) {
    await saveSettings(patch);
    set({ settings: { ...get().settings, ...patch } });
  },
}));
