import { db, getSettings, type UserSettings } from '@/lib/db';
import { getOpenAiApiKey, setOpenAiApiKey } from '@/lib/openai';
import { PROTOCOLS, type ProtocolId } from '@/lib/protocols';
import { useFastStore } from '@/store/useFastStore';
import { useState } from 'react';
import { USDA_FOODS, usdaToFoodItem } from '@/lib/foodDb';

export function Settings() {
  const settings = useFastStore(s => s.settings);
  const loading = useFastStore(s => s.loading);
  const patchSettings = useFastStore(s => s.patchSettings);
  const hydrate = useFastStore(s => s.hydrate);
  const [openAiApiKey, setOpenAiApiKeyState] = useState(() => getOpenAiApiKey());

  if (loading) return <div className="card text-slate-400">Loading…</div>;

  function patch(p: Partial<UserSettings>) {
    void patchSettings(p);
  }

  async function exportJson() {
    const windows = await db.windows.toArray();
    const foodItems = await db.foodItems.toArray();
    const mealEntries = await db.mealEntries.toArray();
    const all = await getSettings();
    const blob = new Blob([JSON.stringify({ windows, foodItems, mealEntries, settings: all }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-app-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function clearAll() {
    if (!confirm('Delete all eating windows and settings? This cannot be undone.')) return;
    await db.windows.clear();
    await db.mealEntries.clear();
    await db.foodItems.clear();
    await db.foodItems.bulkAdd(USDA_FOODS.map(usdaToFoodItem));
    await db.settings.clear();
    await hydrate();
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="label">Settings</div>
        <h1 className="mt-1 font-display text-3xl">Tune the protocol.</h1>
      </header>

      <section className="card">
        <h2 className="font-display text-lg">You</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            <span className="label block mb-1">Sex</span>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
              value={settings.sex ?? ''}
              onChange={e => patch({ sex: (e.target.value || undefined) as UserSettings['sex'] })}
            >
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="label block mb-1">Weight (lb)</span>
            <input
              type="number"
              inputMode="decimal"
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
              value={settings.weightLb ?? ''}
              onChange={e =>
                patch({ weightLb: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </label>
          <label className="text-sm">
            <span className="label block mb-1">Default protocol</span>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
              value={settings.defaultProtocol ?? '18:6'}
              onChange={e =>
                patch({
                  defaultProtocol: (e.target.value || undefined) as ProtocolId | undefined,
                })
              }
            >
              {PROTOCOLS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {settings.sex === 'female' ? (
          <p className="mt-3 text-xs text-amber-200/80">
            Long fasted aerobic work and very long fasts behave differently in women. The
            training page surfaces this; protocols past 24h still apply with extra care.
          </p>
        ) : null}
      </section>

      <section className="card">
        <h2 className="font-display text-lg">Workout window</h2>
        <p className="mt-2 text-sm text-slate-400">
          The window opens this many hours before your fast target — peak growth hormone, better
          muscle retention with resistance + HIIT. Default 2 hours; Jamnadas suggests 1.5–2.
        </p>
        <label className="mt-3 block text-sm">
          <span className="label block mb-1">Workout lead time (hours)</span>
          <input
            type="number"
            step="0.25"
            min="0.5"
            max="6"
            className="w-40 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
            value={settings.workoutLeadHours ?? 2}
            onChange={e =>
              patch({
                workoutLeadHours: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </label>
      </section>

      <section className="card">
        <h2 className="font-display text-lg">AI</h2>
        <p className="mt-2 text-sm text-slate-400">
          Used for nutrition estimates when you add a custom food item.
        </p>
        <label className="mt-3 block text-sm">
          <span className="label block mb-1">OpenAI API key</span>
          <input
            type="password"
            autoComplete="off"
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 text-base"
            value={openAiApiKey}
            onChange={e => {
              const value = e.target.value;
              setOpenAiApiKeyState(value);
              setOpenAiApiKey(value);
            }}
            placeholder="sk-..."
          />
        </label>
      </section>

      <section className="card">
        <h2 className="font-display text-lg">Data</h2>
        <p className="mt-2 text-sm text-slate-400">
          All data is stored locally in your browser (IndexedDB). No account, no sync. Export a
          JSON copy anytime.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => void exportJson()}>
            Export JSON
          </button>
          <button className="btn-danger" onClick={() => void clearAll()}>
            Delete everything
          </button>
        </div>
      </section>
    </div>
  );
}
