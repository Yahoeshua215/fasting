export function Eating() {
  return (
    <div className="space-y-6">
      <header>
        <div className="label">Eating window</div>
        <h1 className="mt-1 font-display text-3xl">Protein-forward, real food.</h1>
        <p className="mt-2 text-sm text-slate-300">
          Most apps stop caring once the timer ends. This one shouldn't. The eating window is
          where lean mass is protected and the gut is fed.
        </p>
      </header>

      <section className="card">
        <div className="label">Coming in Phase 2</div>
        <ul className="mt-2 space-y-2 text-sm text-slate-300">
          <li>· Protein target calculator (default 0.7–1.0 g/lb lean mass).</li>
          <li>· Meal logger with seed-oil / charred / processed flags (and reasons, not shame).</li>
          <li>· Plant-variety counter — 30–40 different plants per week, not just fiber grams.</li>
          <li>· Protein-source library: grass-finished beef, pasture eggs, wild fish, kefir, lentils.</li>
        </ul>
      </section>

      <section className="card">
        <div className="label">Quick reference</div>
        <div className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <div className="text-slate-200 font-medium">Use</div>
            <p className="text-slate-400">
              Olive oil cold; butter / ghee / coconut oil for heat. Inulin/FOS as soluble fiber.
              Fermented foods (kefir, sauerkraut, kimchi) for postbiotics including K2.
            </p>
          </div>
          <div>
            <div className="text-slate-200 font-medium">Avoid</div>
            <p className="text-slate-400">
              Vegetable seed oils, refined wheat, sugary drinks, OJ, charred / heavily fried
              preparations (AGEs). White rice is fine when prepared as resistant starch:
              soak → drain → cook → cool → reheat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
