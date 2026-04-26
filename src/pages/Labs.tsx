interface LabRow {
  name: string;
  why: string;
}

const LAB_ROWS: LabRow[] = [
  {
    name: 'Coronary calcium score (CT)',
    why: 'Direct view of calcified plaque burden. Goal: 0. Tracked over time, it tells you whether your trajectory is improving.',
  },
  {
    name: 'Fasting insulin',
    why: 'The single most under-ordered useful test for pre-clinical metabolic disease. Glucose can look normal for a decade while insulin compensates.',
  },
  {
    name: 'hs-CRP / IL-6 / TNF-α',
    why: 'Systemic inflammation. The drivers behind plaque instability — the thing that actually causes a heart attack.',
  },
  {
    name: 'LDL particle (LDL-P) + oxidized LDL',
    why: 'Particle quality, not just LDL number. Small dense LDL is the dangerous fraction; oxidized LDL is what gets lodged in the arterial wall.',
  },
  {
    name: 'HbA1c',
    why: '90-day glycation average. A trailing indicator that\'s still useful for tracking whether the protocol is doing what you think it is.',
  },
  {
    name: 'Waist circumference',
    why: 'Better visceral-fat proxy than BMI alone. Track monthly.',
  },
];

export function Labs() {
  return (
    <div className="space-y-6">
      <header>
        <div className="label">Self-logged biomarkers</div>
        <h1 className="mt-1 font-display text-3xl">Track what actually matters.</h1>
        <p className="mt-2 text-sm text-slate-300">
          You log values from your physician's panels. The app shows trend over time. No
          integrations, no auto-pulls — just a calm, durable record.
        </p>
      </header>

      <section className="space-y-3">
        {LAB_ROWS.map(r => (
          <article key={r.name} className="card">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-base text-white">{r.name}</h3>
              <button className="btn-ghost" disabled>
                Log value
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-400">{r.why}</p>
          </article>
        ))}
      </section>

      <p className="text-xs text-slate-500">
        Logging UI lands in Phase 3. The list above is the full Cleveland HeartLab–style panel
        worth asking your physician about.
      </p>
    </div>
  );
}
