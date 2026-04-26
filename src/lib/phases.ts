export interface Phase {
  startHour: number;
  label: string;
  shortLabel: string;
  body: string;
  accent: string;
}

export const PHASES: Phase[] = [
  {
    startHour: 0,
    label: 'Postprandial',
    shortLabel: 'Postprandial',
    body:
      'You just ate. Insulin is elevated and glucose is being stored. Nothing fat-burning is happening yet — that\'s normal.',
    accent: 'from-amber-400/30 to-amber-500/10',
  },
  {
    startHour: 4,
    label: 'Glycogen Utilization',
    shortLabel: 'Glycogen',
    body:
      'Insulin is falling. The body is pulling stored glucose (glycogen) from the liver and muscle. Hunger signals come and go.',
    accent: 'from-sky-400/30 to-sky-500/10',
  },
  {
    startHour: 12,
    label: 'Lipolysis Begins',
    shortLabel: 'Lipolysis',
    body:
      'Glycogen depleted. Lipolysis begins, ketones start rising. Visceral fat is the first fat mobilized — the most inflammatory fat goes first.',
    accent: 'from-cyan-400/30 to-cyan-500/10',
  },
  {
    startHour: 16,
    label: 'Ketones Meaningful',
    shortLabel: 'Ketones',
    body:
      'Ketones meaningful. Growth hormone elevated. BDNF rising. This is also the optimal training window — train near the peak of the fast, not the start.',
    accent: 'from-indigo-400/30 to-indigo-500/10',
  },
  {
    startHour: 18,
    label: 'Autophagy Ramping',
    shortLabel: 'Autophagy',
    body:
      'Autophagy ramping. Mental clarity often peaks here. Cells are recycling damaged components.',
    accent: 'from-violet-400/30 to-violet-500/10',
  },
  {
    startHour: 24,
    label: 'Deep Autophagy',
    shortLabel: 'Deep autophagy',
    body:
      'Deeper autophagy. Stem-cell mobilization on refeed — what you eat to break the fast matters as much as the fast itself.',
    accent: 'from-fuchsia-400/30 to-fuchsia-500/10',
  },
  {
    startHour: 36,
    label: 'Insulin Reset',
    shortLabel: 'Insulin reset',
    body:
      'Significant insulin reset. Mitochondrial recycling. This is the territory Jamnadas calls "monthly tune-up."',
    accent: 'from-rose-400/30 to-rose-500/10',
  },
];

export function currentPhase(elapsedHours: number): Phase {
  let active = PHASES[0];
  for (const p of PHASES) {
    if (elapsedHours >= p.startHour) active = p;
  }
  return active;
}

export function nextPhase(elapsedHours: number): Phase | undefined {
  return PHASES.find(p => p.startHour > elapsedHours);
}
