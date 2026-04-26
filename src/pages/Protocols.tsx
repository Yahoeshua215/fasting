import { PROTOCOLS } from '@/lib/protocols';
import { ProtocolCard } from '@/components/ProtocolCard';
import { useFastStore } from '@/store/useFastStore';

export function Protocols() {
  const settings = useFastStore(s => s.settings);
  const current = settings.defaultProtocol ?? '18:6';

  return (
    <div className="space-y-6">
      <header>
        <div className="label">Protocols</div>
        <h1 className="mt-1 font-display text-3xl">Pick the rhythm.</h1>
        <p className="mt-2 text-sm text-slate-300">
          You're always either in a fast or a feeding window — the app tracks meals
          continuously. Your default protocol sets the fast target ({current}) and the eating
          window length used on the live view.
        </p>
      </header>

      <section className="grid gap-4">
        {PROTOCOLS.map(p => (
          <ProtocolCard key={p.id} protocol={p} />
        ))}
      </section>

      <aside className="card border-amber-900/40 bg-amber-950/10">
        <div className="label text-amber-300">Women's physiology — read this</div>
        <p className="mt-2 text-sm text-amber-100/80">
          Long fasted aerobic work and very long fasts behave differently in women, especially
          those of reproductive age. Resistance and HIIT translate well; long fasted treadmill
          work does not.
        </p>
      </aside>

      <aside className="card border-slate-800/60">
        <div className="label">Beyond 24h</div>
        <p className="mt-2 text-sm text-slate-300">
          24h+ protocols don't have a fixed eating window — they're multi-day patterns. The
          app still tracks every meal, and the fast clock keeps counting whether you're at
          17h, 36h, or 72h.
        </p>
      </aside>
    </div>
  );
}
