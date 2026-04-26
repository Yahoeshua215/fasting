export function Training() {
  return (
    <div className="space-y-6">
      <header>
        <div className="label">Training</div>
        <h1 className="mt-1 font-display text-3xl">Train at the peak of the fast.</h1>
        <p className="mt-2 text-sm text-slate-300">
          Roughly the final 2 hours of your fast. Peak growth hormone, better muscle retention.
          Open the active fast view to see today's window.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="label text-emerald-300">Preferred</div>
          <p className="mt-2 text-sm text-slate-200">Resistance training. HIIT (30–45s work / 30–45s rest). Bodyweight flow — planks, leg lifts.</p>
        </div>
        <div className="card">
          <div className="label text-amber-300">Limited</div>
          <p className="mt-2 text-sm text-slate-200">Aerobic — keep moderate cardio to ~15–20 min during a fasted session.</p>
        </div>
        <div className="card">
          <div className="label text-rose-300">Avoid</div>
          <p className="mt-2 text-sm text-slate-200">Long-duration steady-state aerobic (40+ min). Patients with heavy aerobic loads can show <em>more</em> coronary artery disease, not less.</p>
        </div>
      </section>

      <aside className="card border-amber-900/40 bg-amber-950/10">
        <div className="label text-amber-300">Women — read this</div>
        <p className="mt-2 text-sm text-amber-100/80">
          Long fasted aerobic work in women can drive muscle catabolism and HPA axis stress.
          Resistance and HIIT translate well; long fasted treadmill work does not.
        </p>
      </aside>
    </div>
  );
}
