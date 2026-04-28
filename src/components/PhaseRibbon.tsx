import { PHASES, currentPhase, nextPhase } from '@/lib/phases';
import { cn } from '@/lib/utils';

interface PhaseRibbonProps {
  elapsedHours: number;
  totalHours: number;
}

export function PhaseRibbon({ elapsedHours, totalHours }: PhaseRibbonProps) {
  const cap = Math.max(totalHours, PHASES[PHASES.length - 1].startHour + 4);
  const active = currentPhase(elapsedHours);
  const next = nextPhase(elapsedHours);

  return (
    <div className="space-y-3">
      <div className="relative h-3 overflow-hidden rounded-full bg-slate-900/70 ring-1 ring-slate-800">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-indigo-500"
          style={{ width: `${Math.min(100, (elapsedHours / cap) * 100)}%` }}
        />
        {PHASES.map(p => {
          const left = (p.startHour / cap) * 100;
          const reached = elapsedHours >= p.startHour;
          return (
            <span
              key={p.startHour}
              className={cn(
                'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full ring-2',
                reached
                  ? 'bg-white ring-white/60'
                  : 'bg-slate-700 ring-slate-700',
              )}
              style={{ left: `${left}%` }}
              title={p.shortLabel}
            />
          );
        })}
      </div>
      {/* Labels positioned at the same proportional offsets as the dots above */}
      <div className="relative h-4">
        {PHASES.filter(p => p.startHour <= cap).map(p => {
          const left = (p.startHour / cap) * 100;
          return (
            <span
              key={p.startHour}
              className={cn(
                'absolute -translate-x-1/2 text-[10px] sm:text-xs uppercase tracking-widest',
                elapsedHours >= p.startHour ? 'text-slate-300' : 'text-slate-600',
                // Pin the first label to the left edge and last to the right so they don't clip
                p.startHour === 0 && 'translate-x-0',
                p.startHour === PHASES[PHASES.length - 1].startHour && '-translate-x-full',
              )}
              style={{ left: `${left}%` }}
            >
              {p.startHour}h
            </span>
          );
        })}
      </div>
      <div className="card">
        <div className="label">Right now — {active.label}</div>
        <p className="mt-2 text-sm text-slate-200">{active.body}</p>
        {next ? (
          <p className="mt-3 text-xs text-slate-400">
            Next milestone:{' '}
            <span className="text-slate-200">{next.label}</span> at hour {next.startHour}{' '}
            <span className="text-slate-500">
              ({Math.max(0, next.startHour - elapsedHours).toFixed(1)}h to go)
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
