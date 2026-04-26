export type ProtocolId =
  | '12:12'
  | '16:8'
  | '18:6'
  | 'OMAD'
  | '24h'
  | '36h'
  | '48h'
  | '72h';

export interface Protocol {
  id: ProtocolId;
  name: string;
  hours: number;
  /** Length of the eating window in hours, when applicable (24h+ protocols leave undefined). */
  eatingHours?: number;
  cadence: string;
  blurb: string;
  whatHappens: string;
  forWho: string;
  notFor: string;
  requiresSupervision?: boolean;
}

export const PROTOCOLS: Protocol[] = [
  {
    id: '12:12',
    name: '12:12',
    hours: 12,
    eatingHours: 12,
    cadence: 'Daily, 2–3 weeks to start',
    blurb: 'Entry-level. Establishes the rhythm. Visceral fat reduction begins as insulin drops between meals.',
    whatHappens:
      'You finish dinner, skip late-night snacking, and let insulin fall through the night. Mild glycogen drawdown by morning.',
    forWho: 'Anyone new to fasting; people coming off frequent grazing or late-night eating.',
    notFor: 'Already comfortable past 16h — go to 16:8 or 18:6.',
  },
  {
    id: '16:8',
    name: '16:8',
    hours: 16,
    eatingHours: 8,
    cadence: 'Daily maintenance',
    blurb: 'Common maintenance window. Mild ketone production begins toward the back end of the fast.',
    whatHappens: 'Glycogen is depleting; lipolysis starting; ketones trickling up by the final hours.',
    forWho: 'Maintenance, body recomposition, people training in the morning fasted.',
    notFor: 'People still chasing major metabolic correction — 18:6 or longer is more effective.',
  },
  {
    id: '18:6',
    name: '18:6',
    hours: 18,
    eatingHours: 6,
    cadence: 'Daily — Jamnadas’s default target',
    blurb: 'Most people can do this. Ketogenesis kicks in meaningfully past hour 12.',
    whatHappens:
      'Glycogen depleted. Visceral fat is the first fat mobilized. Mental clarity often peaks in the final hours.',
    forWho: 'Default target for healthy adults pursuing metabolic health.',
    notFor: 'Pregnant, lactating, underweight, or actively rebuilding from illness.',
  },
  {
    id: 'OMAD',
    name: 'OMAD (one meal a day)',
    hours: 23,
    eatingHours: 1,
    cadence: '3–4× per week',
    blurb: 'Used for accelerated fat loss / metabolic reset.',
    whatHappens: 'A single, large, protein-forward meal. Long lipolytic window; significant ketone production.',
    forWho: 'People who tolerate 18:6 well and want to step up.',
    notFor: 'Difficult to hit a protein target in one meal — plan accordingly.',
  },
  {
    id: '24h',
    name: '24h fast',
    hours: 24,
    cadence: 'Once weekly',
    blurb: 'Deeper insulin reset; pronounced ketosis.',
    whatHappens: 'Autophagy ramping. Stem-cell mobilization on refeed. Growth hormone elevated.',
    forWho: 'Comfortable past 18h; otherwise healthy adults.',
    notFor: 'Anyone with diabetes, eating-disorder history, or on glucose-lowering medication without supervision.',
  },
  {
    id: '36h',
    name: '36h fast',
    hours: 36,
    cadence: 'At least once a month',
    blurb: 'Drives autophagy, stem-cell mobilization, deeper insulin reset.',
    whatHappens: 'Mitochondrial recycling. Ketones high. Visceral fat continuing to mobilize.',
    forWho: 'Healthy adults using fasting as a periodic tune-up.',
    notFor: 'Rule out medication conflicts first.',
  },
  {
    id: '48h',
    name: '48h fast',
    hours: 48,
    cadence: 'Weekly cadence — supervised',
    blurb: 'Used for diabetes-reversal / heavy weight-loss goals. Supervision strongly advised.',
    whatHappens: 'Deep autophagy, profound insulin and inflammation drop, ketone-dominant metabolism.',
    forWho: 'Goal-directed users with physician oversight.',
    notFor: 'Anyone without a physician relationship for monitoring labs/meds.',
    requiresSupervision: true,
  },
  {
    id: '72h',
    name: '72h water fast',
    hours: 72,
    cadence: '"Every 9 days" pattern (Jamnadas)',
    blurb:
      'Major metabolic correction protocol. Gate behind explicit medical-supervision confirmation.',
    whatHappens:
      'Maximal autophagy, immune-cell turnover, deep insulin reset. Refeed strategy matters as much as the fast.',
    forWho: 'Patients pursuing significant metabolic correction under physician care.',
    notFor: 'Anyone without supervision, on insulin, with eating-disorder history, pregnant, or underweight.',
    requiresSupervision: true,
  },
];

export function getProtocol(id: ProtocolId): Protocol {
  const p = PROTOCOLS.find(p => p.id === id);
  if (!p) throw new Error(`Unknown protocol ${id}`);
  return p;
}
