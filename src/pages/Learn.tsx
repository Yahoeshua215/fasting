import { useState } from 'react';
import { LEARN_TOPICS } from '@/lib/learn';
import { cn } from '@/lib/utils';

export function Learn() {
  const [openId, setOpenId] = useState<string | null>(LEARN_TOPICS[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <header>
        <div className="label">Education library</div>
        <h1 className="mt-1 font-display text-3xl">Why it works.</h1>
        <p className="mt-2 text-sm text-slate-300">
          These are the load-bearing ideas behind the protocol. Paraphrased from Dr. Pradip
          Jamnadas's lectures and corroborated where applicable.
        </p>
      </header>

      <div className="space-y-3">
        {LEARN_TOPICS.map(t => {
          const open = openId === t.id;
          return (
            <article key={t.id} className="card">
              <button
                className="flex w-full items-start justify-between text-left"
                onClick={() => setOpenId(open ? null : t.id)}
              >
                <div>
                  <h3 className="font-display text-lg">{t.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{t.summary}</p>
                </div>
                <span
                  className={cn(
                    'mt-1 ml-3 inline-block h-6 w-6 shrink-0 rounded-full border border-slate-700 text-center text-sm leading-6 text-slate-400 transition',
                    open && 'rotate-45 border-cyan-500/60 text-cyan-300',
                  )}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {open ? (
                <div className="mt-4 space-y-3 border-t border-slate-800 pt-4 text-sm text-slate-200">
                  {t.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
