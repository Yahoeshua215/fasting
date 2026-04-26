export interface LearnTopic {
  id: string;
  title: string;
  summary: string;
  body: string[];
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'insulin-vs-glucose',
    title: 'Insulin vs. glucose',
    summary:
      'Why hyperinsulinemia is the silent decade before a diabetes diagnosis — and why your fasting glucose is the wrong test.',
    body: [
      'Glucose is the symptom; insulin is the driver. By the time fasting glucose creeps up, insulin has often been compensating for a decade.',
      'The single most under-ordered useful test for pre-clinical metabolic disease is fasting insulin. A "normal" glucose with a high fasting insulin is not normal.',
      'Fasting works because it lets insulin fall. Sustained high insulin keeps you in storage mode and blocks lipolysis no matter how much you cut calories.',
    ],
  },
  {
    id: 'visceral-vs-subcutaneous',
    title: 'Visceral fat vs. subcutaneous fat',
    summary:
      'Two different organs with two different inflammatory profiles. Visceral fat is the one that goes first.',
    body: [
      'Subcutaneous fat is largely cosmetic. Visceral fat (around organs) is metabolically active and pumps out IL-6, TNF-α, and other inflammatory signals that drive cardiovascular disease.',
      'Waist circumference is a better visceral-fat proxy than BMI. A "skinny fat" BMI 22 with a 38-inch waist can carry more metabolic risk than a heavier person with a tighter waist.',
      'Good news: visceral fat is the first fat mobilized during a fast. The most inflammatory fat goes first.',
    ],
  },
  {
    id: 'plaque-rupture',
    title: 'Plaque, rupture, and what a heart attack actually is',
    summary:
      'The size of the plaque is not what kills you. The rupture of an inflamed plaque is.',
    body: [
      'A heart attack is a clot, not a stenosis. Inflamed unstable plaques rupture and trigger a clot that occludes the artery.',
      'Stable plaque can sit there for decades. The goal is to lower the inflammatory drivers (small dense LDL, oxidized LDL, hs-CRP, IL-6) that destabilize plaques in the first place.',
      'This reframes the lab panel: you are not chasing total cholesterol; you are chasing inflammation and damaged lipoproteins.',
    ],
  },
  {
    id: 'ldl-particle-quality',
    title: 'Small dense LDL vs. large fluffy LDL',
    summary:
      'Particle quality matters more than the LDL number on a standard panel. Five drivers damage LDL.',
    body: [
      'Small dense LDL is what oxidizes, gets stuck in the arterial wall, and drives plaque. Large fluffy LDL is largely benign.',
      'The five drivers of damaged LDL: glucose (glycation), excess omega-6 (oxidized seed oils), AGEs (charred/fried preparations), toxins, and lipopolysaccharides from a leaky gut.',
      'A standard lipid panel does not tell you this. Ask for an LDL-particle (LDL-P), oxidized LDL, and hs-CRP. Cleveland HeartLab–style panels capture it.',
    ],
  },
  {
    id: 'autophagy-stem-cells',
    title: 'Autophagy, mitochondria, BDNF, growth hormone',
    summary:
      'What actually flips on past hour 16, and why the "monthly 36h" pattern matters.',
    body: [
      'Hour 12+: lipolysis and ketones. Hour 16+: meaningful ketones, growth hormone elevated, BDNF rising. Hour 18+: autophagy ramps. Hour 24+: stem-cell mobilization on refeed. Hour 36+: deeper insulin reset and mitochondrial recycling.',
      'These aren\'t marketing terms. They are the reasons fasting affects metabolic health independently of weight.',
      'The refeed meal is not a footnote. Stem-cell mobilization keys off it — protein-forward, real-food refeed, not a sugar bomb.',
    ],
  },
  {
    id: 'vagus',
    title: 'The vagus nerve — gut, heart, HRV',
    summary:
      'A practical lever. Daily 4-in / 8-out breathing, humming, cold on the front of the neck.',
    body: [
      'Vagal tone connects the gut and heart. Better vagal tone shows up as higher HRV and lower resting heart rate.',
      'Daily practice that costs nothing: 10 minutes of 4-in / 8-out breathing. Humming and singing also stimulate the vagus.',
      'These aren\'t replacements for sleep, food, and movement. They\'re multipliers on top.',
    ],
  },
  {
    id: 'gut-and-mouth',
    title: 'Mold, leaky gut, oral microbiome',
    summary:
      'Cardiovascular disease has a gut and mouth component most cardiologists never investigate.',
    body: [
      'Lipopolysaccharides from a leaky gut drive systemic inflammation and damage LDL.',
      'The oral microbiome predicts cardiovascular outcomes. Gum inflammation is not a dental problem in isolation.',
      'Mold burden in homes is more common than people think — Jamnadas notes ~70% of homes show some burden. Worth checking when chronic inflammation refuses to budge.',
    ],
  },
];
