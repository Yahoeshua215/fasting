import Dexie, { type Table } from 'dexie';
import type { ProtocolId } from './protocols';

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

class FastingDB extends Dexie {
  windows!: Table<EatingWindow, number>;
  settings!: Table<UserSettings, string>;

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
