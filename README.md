# Fasting Tracker

An opinionated, physiology-aware intermittent fasting companion grounded in the work of Dr. Pradip Jamnadas, MD. See [`plan.md`](./plan.md) for the full vision and roadmap.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- Zustand (app state)
- Dexie (IndexedDB persistence)

## Develop

```bash
npm install
npm run dev
```

Open the printed URL. Data is stored locally in your browser via IndexedDB — no account required.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — typecheck + production build
- `npm run preview` — preview the production build
- `npm run typecheck` — TypeScript only

## Status

Phase 1 (MVP timer + protocols + phase ribbon + IndexedDB + PWA shell) is in. Phase 2 (eating + training detail), Phase 3 (biomarker logging + charts), Phase 4 (notifications + onboarding), and Phase 5 (optional sync) follow the plan.
