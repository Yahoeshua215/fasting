# Fasting Tracker — Project Plan

A React-based web app for tracking intermittent fasting protocols, grounded in the work of Dr. Pradip Jamnadas, MD (cardiologist, founder of Cardiovascular Interventions, P.A., Orlando) and corroborated best practices from the broader fasting/metabolic-health literature.

> **Disclaimer to surface in-app:** This app is educational. It is not medical advice. Extended fasts (24h+), fasting with diabetes, pregnancy, or chronic conditions require physician supervision.

---

## 1. Vision

A focused, opinionated fasting companion that doesn't just count down a timer — it teaches the user *why* each protocol works, tells them *when* to train, and helps them *protect lean mass* during their feeding window. The app reflects a specific point of view (Jamnadas's): fasting is a normal, lost human physiology, and the goal is metabolic health (low insulin, low visceral fat, low inflammation), not just weight loss.

## 2. Target User

Adults (likely 30+) who already know what intermittent fasting is, want a structured protocol, care about cardiovascular and metabolic health, and want guidance on training and nutrition layered on top of the timer — not just another stopwatch.

---

## 3. Core Features

### 3.1 Protocol selection
Pre-built protocols with descriptions, intended use cases, and Jamnadas-aligned guidance:

- **12:12** — entry-level, 2–3 weeks. Establishes the rhythm. Visceral fat reduction begins as insulin drops between meals.
- **16:8** — common maintenance protocol; mild ketone production begins toward the back end of the fast.
- **18:6** — Jamnadas's go-to "time-restricted feeding" target. Most people can do this. Ketogenesis kicks in meaningfully past hour 12.
- **OMAD (one meal a day)** — used 3–4×/week for accelerated fat loss / metabolic reset.
- **24h fast** — once-weekly option.
- **36h fast** — recommended at least once a month for "normal, healthy people." Drives autophagy, stem-cell mobilization, deeper insulin reset.
- **48h fast** — weekly cadence for diabetes-reversal / heavy weight-loss goals (supervision strongly advised).
- **72h (3-day) water fast** — "every 9 days" pattern Jamnadas uses with patients pursuing major metabolic correction. **Gate behind explicit medical-supervision confirmation.**

Each protocol page should include: target outcome, what's happening physiologically hour-by-hour, who it's for, who it's NOT for.

### 3.2 The active fast — timer & phase view
Live countdown with a "phase ribbon" showing where the user is on the metabolic timeline:

- **Hours 0–4** — postprandial; insulin elevated, glucose being stored.
- **Hours 4–12** — glucose/glycogen utilization; insulin falling.
- **Hour 12+** — glycogen depleted; lipolysis begins; ketones start rising. **Visceral fat is the first fat mobilized.**
- **Hour 16+** — ketones meaningful; growth hormone elevated; BDNF rising.
- **Hour 18+** — autophagy ramping; mental clarity often peaks.
- **Hour 24+** — deeper autophagy, stem-cell mobilization on refeed.
- **Hour 36+** — significant insulin reset, mitochondrial recycling.

UI: a circular progress ring + a horizontal timeline marking the phases the user has crossed and the next milestone. Educational micro-copy unlocks at each phase.

### 3.3 Workout timing — "Train at the peak of the fast"
Jamnadas's specific recommendation: train **near the end** of the fasting window, not at the start. If breaking fast at 6pm, train ~4pm. Why: peak growth hormone, better muscle retention with resistance + HIIT.

- App computes a recommended training window: **roughly the final 2 hours of the fast**, with a buffer.
- Push notification / visual cue: "Optimal training window opens in 45 min."
- Workout-type guidance baked in:
  - **Preferred:** resistance training, HIIT (30–45s work / 30–45s rest), bodyweight flow (planks, leg lifts).
  - **Limited:** aerobic — 15–20 min of moderate cardio max.
  - **Avoid:** long-duration aerobic (e.g., 40+ min steady-state). Jamnadas observes that overly aerobic patients show *more* coronary artery disease, not less.
- **Women's caveat surfaced explicitly** (per Stacy Sims, referenced in the source): long fasted aerobic work in women can drive muscle catabolism and HPA axis stress; resistance + HIIT translate well; long fasted treadmill work does not. Show this caveat when a female user selects a long aerobic session.

### 3.4 Eating window — protein & nutrition guidance
The eating window is where most apps stop caring. This one shouldn't.

- **Protein targeting** — user enters bodyweight; app suggests a daily protein target (default range 0.7–1.0 g/lb lean mass; adjustable). Splits across the meals available in the eating window (e.g., OMAD = one meal; 18:6 = 1–2 meals).
- **Protein source library** — grass-finished beef, pasture-raised eggs (Jamnadas: "absolutely no concerns" about eggs and cholesterol), wild fish (omega-3), chicken/turkey, lentils/legumes for vegetarian users, kefir.
- **"Eat real food" filter** — flag/avoid: vegetable seed oils, refined wheat, white rice (unless prepared as resistant starch — soak, drain, cook, cool, reheat — instructions included), processed bars, sugary drinks, orange juice, excessive fruit.
- **Cooking guidance** — avoid blackened/charred/heavily-fried preparations (advanced glycation end products / AGEs drive inflammation). Suggest olive oil cold, butter / ghee / coconut oil hot.
- **Fiber tracker** — Jamnadas pushes 30–40 different plant types per week. App shows a weekly "plant variety" counter, not just total fiber grams. Inulin/FOS recommended as a supplemental soluble fiber.
- **Fermented foods nudge** — kefir, sauerkraut, kimchi, etc. for postbiotics (incl. K2).

### 3.5 Supplement & lifestyle layer
A simple daily checklist reflecting Jamnadas's stack and lifestyle priorities. None of this is auto-recommended as medical guidance — it's a configurable checklist users can opt into.

- Vitamin D3 + K2 (NOT calcium supplements — Jamnadas explicitly stops calcium supplements in cardiac patients).
- Omega-3 (EPA/DHA).
- Magnesium.
- Inulin + FOS (soluble fiber).
- Optional: nattokinase, mega-spore probiotic (note: spore-based, survives stomach acid).
- Electrolytes during fasting windows: pinch of Celtic salt or LMNT-style electrolyte once daily.
- MCT oil (1 tsp in water) for hunger spikes during long fasts.

Lifestyle checklist:
- 7+ hours sleep (one bad night → next-day insulin resistance).
- Daily 4–8 breathing (in-4, out-8) for 10 min — vagal tone.
- Humming / singing / cold on front of neck — vagal hacks.
- Eye-movement and gentle eyeball-cooling vagal stimulation (optional, with caveats).
- Mold check prompt — Jamnadas notes ~70% of homes show some mold burden; surface a periodic "have you checked for water damage?" reminder.

### 3.6 Metrics & screening reminders
The app should periodically remind the user about the screening tests Jamnadas recommends (the user can log values manually):

- **Coronary calcium score** (CT) — baseline if 30+ with concerns. Goal: 0. Track over time.
- **Cleveland HeartLab–style inflammatory panel** — LDL particle size (small dense vs. large fluffy), oxidized LDL, hs-CRP, IL-6, TNF-α, HbA1c, fasting insulin (NOT just glucose).
- **Fasting insulin** — flagged as the single most under-ordered useful test for pre-clinical metabolic disease.
- **Waist circumference** — a better visceral-fat proxy than BMI alone.

These are *log-and-track* fields, not derived from anything. The educational copy explains *why* each one matters.

### 3.7 Education / "Why it works" library
A library of short read-mes pulled directly from the Jamnadas source material, organized by topic:

- Insulin vs. glucose — why hyperinsulinemia is the silent decade before a diabetes diagnosis.
- Visceral fat vs. subcutaneous fat — different organ, different inflammatory profile (IL-6, TNF-α).
- Plaque, plaque rupture, blood clot — what a heart attack actually is.
- Small dense LDL vs. large fluffy LDL — the five drivers of damaged LDL: glucose, omega-6, AGEs, toxins, lipopolysaccharides (leaky gut).
- Autophagy, mitochondrial recycling, BDNF, growth hormone, stem cells, endothelial progenitor cells.
- The vagus nerve — gut-heart axis, HRV, vagal hacks.
- Mold, leaky gut, food sensitivities, oral microbiome → cardiovascular disease.

---

## 4. Technical Stack

- **Frontend:** React 18 + TypeScript, Vite for dev/build.
- **Styling:** Tailwind CSS. Shadcn/ui for component primitives.
- **State:** Zustand for app state (timer, current protocol, daily logs). React Query if/when a backend lands.
- **Routing:** React Router.
- **Charts:** Recharts (weight, waist, calcium score over time, fasting streaks).
- **Persistence (v1):** IndexedDB via Dexie. Local-only, no account required. Export/import JSON.
- **Persistence (v2):** Optional Supabase backend for sync across devices.
- **PWA:** Installable, offline-capable, background timer notifications.
- **Notifications:** Web Push for "training window opens", "fast complete", "refeed reminder".
- **Testing:** Vitest + React Testing Library; Playwright for the timer/notification flows.

---

## 5. Information Architecture

- `/` — Dashboard: current fast (or "Start a fast" CTA), today's training window, today's protein target, weekly plant-variety count.
- `/start` — Protocol picker with explanations.
- `/active` — Active fast view: ring timer, phase ribbon, "what's happening in your body right now" copy, training-window callout.
- `/eating` — Active eating window: protein target & remaining, meal logger, plant-variety tally.
- `/training` — Today's recommended workout type and timing; logger.
- `/learn` — Education library.
- `/labs` — Self-logged biomarkers + trend charts.
- `/settings` — Sex, weight, protocol defaults, notification prefs, supplement checklist config, supervision-confirmation toggles for 48h+ fasts.

---

## 6. Data Model (sketch)

- `User` — sex, DOB, weight, height, activity level, protocol default, dietary pattern (omnivore / vegetarian / etc.).
- `FastSession` — protocolId, startAt, plannedEndAt, actualEndAt, notes, breakReason.
- `Meal` — fastSessionId (or standalone), eatenAt, items[], proteinGrams, plantTypes[], flagged (seed oil / processed / charred).
- `Workout` — sessionId, type (resistance / HIIT / aerobic / flow), duration, intensity, performedDuringFast (bool), hoursIntoFast.
- `Biomarker` — date, kind (CAC, hsCRP, fastingInsulin, HbA1c, LDL-P, oxLDL, waist, weight), value, units, source.
- `SupplementLog` — date, items[].
- `LifestyleLog` — date, sleepHours, breathwork (bool), moodNotes.

---

## 7. Implementation Phases

**Phase 1 — MVP timer + protocols (1–2 weeks)**
Protocol picker, active timer with phase ribbon, basic education pages, IndexedDB persistence, PWA shell. No backend.

**Phase 2 — Training & eating layer (1–2 weeks)**
Training-window computation, workout logger with type guidance, protein target calculator, meal logger with seed-oil / AGE / processed-food flags, plant-variety counter.

**Phase 3 — Biomarkers & education depth (1 week)**
Self-logged labs with trend charts, full education library, supplement & lifestyle checklist.

**Phase 4 — Polish (1 week)**
Notifications, export/import, accessibility pass, mobile install flow, empty states, onboarding.

**Phase 5 — Optional sync (later)**
Supabase auth + sync, multi-device, optional sharing of trends with a clinician.

---

## 8. Risks & Things To Get Right

- **Medical-disclaimer surface area.** Long fasts and "reverse your diabetes" claims need careful framing. Anything past 24h should require an explicit "I have medical supervision" toggle. The app educates; it does not prescribe.
- **Women's physiology.** Don't paper over it. Fasted long aerobic work and very long fasts behave differently in women, especially those of reproductive age. Surface this in protocol selection, not buried in settings.
- **Don't moralize food.** "Flagged" foods are flagged with a reason, not shamed. Sourdough, occasional fruit in season, properly-prepared rice are all fine — the app should reflect that nuance, not be a purity test.
- **Battery / background timer reliability.** PWA timers need server-time anchoring so a closed tab still produces correct phase detection on reopen.
- **Source attribution.** Educational copy paraphrases Jamnadas; it should credit him by name and link out to his channel rather than presenting his views as anonymous truth.
- **Scope discipline.** It is tempting to build a full health-tracker. Resist. The differentiator is the *opinionated, physiology-aware fasting companion*, not a generic dashboard.

---

## 9. Out of Scope (v1)

- Wearable integrations (Apple Health, Oura, Whoop).
- Calorie counting (deliberately — Jamnadas distinguishes fasting from caloric restriction; app reflects that).
- Social / streaks-as-gamification (the goal is a physiological practice, not a Duolingo loop).
- AI meal photo recognition.
- Direct lab integrations.

These are good Phase 6+ candidates once the core experience earns daily use.
