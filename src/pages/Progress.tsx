import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import { useFastStore } from '@/store/useFastStore';
import { buildDayStats, buildWeekStats, type RangeKey, type DayStats } from '@/lib/analytics';
import { getProteinTarget } from '@/lib/nutrition';
import { cn } from '@/lib/utils';

type TabKey = 'fasting' | 'eating' | 'nutrition';

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
];

const TAB_OPTIONS: { key: TabKey; label: string }[] = [
  { key: 'fasting', label: 'Fasting' },
  { key: 'eating', label: 'Eating window' },
  { key: 'nutrition', label: 'Nutrition' },
];

const CHART_COLORS = {
  target: '#22d3ee',   // cyan-400
  good: '#34d399',     // emerald-400
  warn: '#fbbf24',     // amber-400
  bad: '#f87171',      // red-400
  protein: '#818cf8',  // indigo-400
  fat: '#fb923c',      // orange-400
  carbs: '#4ade80',    // green-400
  calories: '#e879f9', // fuchsia-400
  grid: '#1e293b',     // slate-800
  axis: '#475569',     // slate-600
};

// Custom tooltip styles shared across charts
function ChartTooltip({
  active, payload, label, unit = '',
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-medium text-slate-300">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-medium text-white">
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Fasting chart ────────────────────────────────────────────────────────────
function FastingChart({ data }: { data: DayStats[] }) {
  const hasFastData = data.some(d => d.fastHours !== null);

  // Streak / summary stats
  const daysWithData = data.filter(d => d.fastHours !== null);
  const hitCount = daysWithData.filter(d => d.hitTarget).length;
  const avgFast = daysWithData.length
    ? (daysWithData.reduce((s, d) => s + (d.fastHours ?? 0), 0) / daysWithData.length).toFixed(1)
    : null;
  const longestFast = daysWithData.reduce((max, d) => Math.max(max, d.fastHours ?? 0), 0);

  const chartData = data.map(d => ({
    label: d.label,
    hours: d.fastHours,
  }));

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Avg fast" value={avgFast ? `${avgFast}h` : '—'} />
        <StatCard label="Days on target" value={daysWithData.length ? `${hitCount}/${daysWithData.length}` : '—'} />
        <StatCard label="Longest fast" value={longestFast ? `${longestFast}h` : '—'} />
      </div>

      {hasFastData ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 24]}
                ticks={[0, 6, 12, 18, 24]}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}h`}
              />
              <ReferenceLine y={18} stroke={CHART_COLORS.target} strokeDasharray="4 3" label={{ value: '18h target', position: 'insideTopRight', fill: CHART_COLORS.target, fontSize: 10 }} />
              <Tooltip content={<ChartTooltip unit="h" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="hours" name="Fast" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.hours === null
                        ? CHART_COLORS.grid
                        : entry.hours >= 18
                        ? CHART_COLORS.good
                        : entry.hours >= 16
                        ? CHART_COLORS.warn
                        : CHART_COLORS.bad
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState message="No completed fasts in this range yet." />
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
        <LegendDot color={CHART_COLORS.good} label="≥ 18h" />
        <LegendDot color={CHART_COLORS.warn} label="16–18h" />
        <LegendDot color={CHART_COLORS.bad} label="< 16h" />
      </div>
    </div>
  );
}

// ── Eating window chart ──────────────────────────────────────────────────────
function EatingWindowChart({ data }: { data: DayStats[] }) {
  const hasData = data.some(d => d.eatStartHour !== null);
  const daysWithData = data.filter(d => d.eatHours !== null);
  const avgDuration = daysWithData.length
    ? (daysWithData.reduce((s, d) => s + (d.eatHours ?? 0), 0) / daysWithData.length).toFixed(1)
    : null;
  const avgStart = daysWithData.length
    ? daysWithData.reduce((s, d) => s + (d.eatStartHour ?? 0), 0) / daysWithData.length
    : null;

  function fmtHour(h: number | null) {
    if (h === null) return '—';
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const display = hrs > 12 ? hrs - 12 : hrs === 0 ? 12 : hrs;
    return `${display}:${String(mins).padStart(2, '0')} ${ampm}`;
  }

  // For range chart: base = eatStartHour, size = eatHours (stacked bar trick)
  const chartData = data.map(d => ({
    label: d.label,
    base: d.eatStartHour,
    duration: d.eatHours,
    startLabel: fmtHour(d.eatStartHour),
    endLabel: fmtHour(d.eatEndHour),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Avg duration" value={avgDuration ? `${avgDuration}h` : '—'} />
        <StatCard label="Avg start" value={fmtHour(avgStart)} />
        <StatCard label="Days logged" value={daysWithData.length > 0 ? String(daysWithData.length) : '—'} />
      </div>

      {hasData ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[6, 24]}
                ticks={[6, 8, 10, 12, 14, 16, 18, 20, 22, 24]}
                tickFormatter={v => {
                  const h = v % 12 === 0 ? 12 : v % 12;
                  return `${h}${v < 12 || v === 24 ? 'a' : 'p'}`;
                }}
                tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
                      <div className="mb-1 font-medium text-slate-300">{label}</div>
                      <div className="text-slate-400">Start: <span className="text-white">{d.startLabel}</span></div>
                      <div className="text-slate-400">End: <span className="text-white">{d.endLabel}</span></div>
                      {d.duration && <div className="text-slate-400">Duration: <span className="text-white">{d.duration}h</span></div>}
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              {/* Invisible base bar to offset */}
              <Bar dataKey="base" stackId="a" fill="transparent" />
              {/* Visible eating window bar */}
              <Bar dataKey="duration" stackId="a" name="Eating window" fill={CHART_COLORS.target} radius={[3, 3, 0, 0]} />
              <ReferenceLine y={12} stroke={CHART_COLORS.axis} strokeDasharray="3 3" label={{ value: 'Noon', position: 'insideTopRight', fill: CHART_COLORS.axis, fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState message="No eating windows recorded in this range yet." />
      )}

      <p className="text-xs text-slate-500">Each bar shows when your eating window was open. Aim for a consistent daily start time.</p>
    </div>
  );
}

// ── Nutrition chart ──────────────────────────────────────────────────────────
function NutritionChart({ data, proteinTarget }: { data: DayStats[]; proteinTarget: number }) {
  const [metric, setMetric] = useState<'macros' | 'protein' | 'calories'>('protein');

  const hasData = data.some(d => d.calories > 0);
  const daysWithData = data.filter(d => d.calories > 0);

  const avgProtein = daysWithData.length
    ? Math.round(daysWithData.reduce((s, d) => s + d.protein, 0) / daysWithData.length)
    : 0;
  const avgCalories = daysWithData.length
    ? Math.round(daysWithData.reduce((s, d) => s + d.calories, 0) / daysWithData.length)
    : 0;
  const daysHitProtein = daysWithData.filter(d => d.protein >= proteinTarget).length;

  const chartData = data.map(d => ({
    label: d.label,
    protein: d.protein || null,
    fat: d.fat || null,
    carbs: d.carbs || null,
    calories: d.calories || null,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Avg protein" value={avgProtein ? `${avgProtein}g` : '—'} />
        <StatCard label="Hit protein goal" value={daysWithData.length ? `${daysHitProtein}/${daysWithData.length}` : '—'} />
        <StatCard label="Avg calories" value={avgCalories ? String(avgCalories) : '—'} />
      </div>

      {/* Sub-metric toggle */}
      <div className="flex gap-1">
        {(['protein', 'macros', 'calories'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs transition capitalize',
              metric === m
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {hasData ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            {metric === 'macros' ? (
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="label" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}g`} />
                <Tooltip content={<ChartTooltip unit="g" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: CHART_COLORS.axis }} />
                <Bar dataKey="protein" name="Protein" stackId="m" fill={CHART_COLORS.protein} radius={[0, 0, 0, 0]} />
                <Bar dataKey="fat" name="Fat" stackId="m" fill={CHART_COLORS.fat} />
                <Bar dataKey="carbs" name="Carbs" stackId="m" fill={CHART_COLORS.carbs} radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : metric === 'protein' ? (
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="label" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}g`} />
                <ReferenceLine y={proteinTarget} stroke={CHART_COLORS.target} strokeDasharray="4 3" label={{ value: `${proteinTarget}g target`, position: 'insideTopRight', fill: CHART_COLORS.target, fontSize: 10 }} />
                <Tooltip content={<ChartTooltip unit="g" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="protein" name="Protein" radius={[3, 3, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.protein !== null && d.protein >= proteinTarget ? CHART_COLORS.good : CHART_COLORS.protein} />
                  ))}
                </Bar>
              </ComposedChart>
            ) : (
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="label" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="calories" name="Calories" fill={CHART_COLORS.calories} radius={[3, 3, 0, 0]} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState message="No meals logged in this range yet." />
      )}
    </div>
  );
}

// ── Weekly summary table ─────────────────────────────────────────────────────
function WeeklySummary({ data }: { data: DayStats[] }) {
  const weeks = buildWeekStats(data);
  if (!weeks.length) return null;

  return (
    <section className="card">
      <h2 className="font-display text-base sm:text-lg">Weekly summary</h2>
      <div className="mt-3 overflow-x-auto scrollbar-hide">
        <table className="w-full text-xs text-slate-400 min-w-[420px]">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              <th className="pb-2 font-medium text-slate-300">Week</th>
              <th className="pb-2 font-medium text-slate-300">Avg fast</th>
              <th className="pb-2 font-medium text-slate-300">Avg eat window</th>
              <th className="pb-2 font-medium text-slate-300">Days on target</th>
              <th className="pb-2 font-medium text-slate-300">Avg protein</th>
              <th className="pb-2 font-medium text-slate-300">Avg cal</th>
            </tr>
          </thead>
          <tbody>
            {[...weeks].reverse().map((w, i) => (
              <tr key={i} className="border-b border-slate-800/50 last:border-0">
                <td className="py-2 text-slate-300">{w.weekLabel}</td>
                <td className="py-2">{w.avgFastHours !== null ? `${w.avgFastHours}h` : '—'}</td>
                <td className="py-2">{w.avgEatHours !== null ? `${w.avgEatHours}h` : '—'}</td>
                <td className="py-2">
                  <span className={cn(
                    'font-medium',
                    w.daysHitTarget >= w.totalDays * 0.8 ? 'text-emerald-400' :
                    w.daysHitTarget >= w.totalDays * 0.5 ? 'text-amber-400' : 'text-red-400',
                  )}>
                    {w.daysHitTarget}/{w.totalDays}
                  </span>
                </td>
                <td className="py-2">{w.avgProtein ? `${w.avgProtein}g` : '—'}</td>
                <td className="py-2">{w.avgCalories || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5 text-center">
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold text-slate-100 tabular-nums leading-none">{value}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
      {message}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function Progress() {
  const windows = useFastStore(s => s.windows);
  const mealEntries = useFastStore(s => s.mealEntries);
  const foodItems = useFastStore(s => s.foodItems);
  const settings = useFastStore(s => s.settings);

  const [range, setRange] = useState<RangeKey>('30d');
  const [tab, setTab] = useState<TabKey>('fasting');

  const foodById = useMemo(() => new Map(foodItems.map(f => [f.id!, f])), [foodItems]);
  const dayStats = useMemo(
    () => buildDayStats(windows, mealEntries, foodById, range),
    [windows, mealEntries, foodById, range],
  );

  const proteinTarget = getProteinTarget(settings.weightLb).min;

  return (
    <div className="space-y-4 sm:space-y-6">
      <header>
        <div className="label">Progress</div>
        <h1 className="mt-1 font-display text-xl sm:text-2xl">Track your trends.</h1>
      </header>

      {/* Range selector */}
      <div className="flex gap-1.5">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setRange(opt.key)}
            className={cn(
              'rounded-xl px-3 py-2 text-sm font-medium transition min-h-[40px]',
              range === opt.key
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 border-b border-slate-800 pb-1">
        {TAB_OPTIONS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-t-lg px-3 py-2 text-sm transition min-h-[40px]',
              tab === t.key
                ? 'border-b-2 border-cyan-400 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <section className="card">
        {tab === 'fasting' && <FastingChart data={dayStats} />}
        {tab === 'eating' && <EatingWindowChart data={dayStats} />}
        {tab === 'nutrition' && <NutritionChart data={dayStats} proteinTarget={proteinTarget} />}
      </section>

      {/* Weekly summary — only show for 30d/90d */}
      {range !== '7d' && <WeeklySummary data={dayStats} />}
    </div>
  );
}
