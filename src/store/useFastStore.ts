import { create } from 'zustand';
import {
  db,
  getRecentWindows,
  getSettings,
  saveSettings,
  type EatingWindow,
  type UserSettings,
} from '@/lib/db';

interface FastState {
  windows: EatingWindow[];
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
  patchSettings: (patch: Partial<UserSettings>) => Promise<void>;
}

async function refreshWindows(): Promise<EatingWindow[]> {
  const list = await getRecentWindows(50);
  return list.sort((a, b) => a.startedAt - b.startedAt);
}

export const useFastStore = create<FastState>((set, get) => ({
  windows: [],
  settings: { id: 'singleton' },
  loading: true,

  async hydrate() {
    const [windows, settings] = await Promise.all([refreshWindows(), getSettings()]);
    set({ windows, settings, loading: false });
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

  async patchSettings(patch) {
    await saveSettings(patch);
    set({ settings: { ...get().settings, ...patch } });
  },
}));
