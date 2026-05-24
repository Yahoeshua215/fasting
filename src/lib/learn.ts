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
    id: 'eating-window',
    title: 'Eating window: protein-forward, real food',
    summary:
      'The eating window is where lean mass is protected and the gut is fed. What you eat matters as much as when.',
    body: [
      'Protein target: aim for 0.7–1.0 g/lb lean mass per day. Good sources: grass-finished beef, pasture eggs, wild fish, kefir, lentils.',
      'Plant variety matters more than fiber grams alone — aim for 30–40 different plants per week.',
      'Use: olive oil cold; butter, ghee, or coconut oil for heat. Inulin/FOS as soluble fiber. Fermented foods (kefir, sauerkraut, kimchi) for postbiotics including K2.',
      'Avoid: vegetable seed oils, refined wheat, sugary drinks, OJ, charred or heavily fried preparations (AGEs). White rice is fine when prepared as resistant starch: soak → drain → cook → cool → reheat.',
    ],
  },
  {
    id: 'training',
    title: 'Training: train at the peak of the fast',
    summary:
      'The final ~2 hours of your fast — peak growth hormone, better muscle retention. Not all exercise types translate equally.',
    body: [
      'Preferred: resistance training, HIIT (30–45s work / 30–45s rest), bodyweight flow — planks, leg lifts.',
      'Limited: moderate aerobic — keep fasted cardio to ~15–20 min.',
      'Avoid: long-duration steady-state aerobic (40+ min). Heavy aerobic loads have been associated with more coronary artery disease, not less.',
      'Women: long fasted aerobic work can drive muscle catabolism and HPA axis stress. Resistance and HIIT translate well; long fasted treadmill sessions do not.',
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

  // ── Dr. Sten Ekberg ───────────────────────────────────────────────────────
  {
    id: 'ekberg-fat-adaptation',
    title: 'Fat adaptation: becoming a fat burner',
    summary:
      'Most people run on glucose by default. Fat adaptation rewires your metabolism to burn fat as its primary fuel — the state your body was designed for.',
    body: [
      'You are either a sugar burner or a fat burner. Sugar burners crash between meals, crave carbs constantly, and can\'t access stored body fat efficiently. Fat burners are metabolically flexible — they can tap body fat for hours without hunger or energy dips.',
      'The transition takes 2–6 weeks. During this time, the body upregulates fat-burning enzymes and builds mitochondrial density. Short-term energy dips are the cost of a long-term upgrade.',
      'Key markers of fat adaptation: stable energy between meals, absence of "hanger," mental clarity in the fasted state, and easy access to ketones. A blood ketone meter (target 0.5–3.0 mmol/L) makes the shift concrete.',
      'Fasting accelerates fat adaptation dramatically. Every hour you extend the fast is an hour you spend training the fat-burning machinery. This is why the protocol and the food choices reinforce each other.',
    ],
  },
  {
    id: 'ekberg-nutrient-density',
    title: 'Nutrient density: organ meats & the real food hierarchy',
    summary:
      'Liver is the most nutrient-dense food on Earth. Ekberg argues that modern chronic disease is largely a nutrient-deficiency problem disguised as a calorie problem.',
    body: [
      'Beef liver contains more vitamin A, B12, folate, iron, copper, zinc, and CoQ10 per gram than any multivitamin. 4 oz per week covers most micronutrient bases most people supplement individually.',
      'The hierarchy Ekberg recommends: organ meats → pasture-raised eggs → grass-fed ruminants → wild-caught fatty fish → low-carb vegetables → nuts and seeds. This is not about restriction — it\'s about getting the most signal per bite.',
      'Pasture-raised eggs are nearly a complete food: all fat-soluble vitamins (A, D, E, K2), choline for the brain, and a complete amino acid profile. Ekberg calls them "the most perfect food." Aim for 2–4 per day.',
      'Anti-nutrients in plants (oxalates, lectins, phytates) reduce absorption of minerals. Cooking, fermenting, and soaking reduce them. Prioritize cooked leafy greens and fermented vegetables over raw grains and legumes.',
    ],
  },
  {
    id: 'ekberg-seed-oils',
    title: 'Seed oils: why industrial fats are driving inflammation',
    summary:
      'Vegetable seed oils (canola, soybean, corn, sunflower) are high in omega-6 linoleic acid. Heated, they oxidize and become directly atherogenic.',
    body: [
      'Humans evolved on an omega-6 to omega-3 ratio of roughly 1:1 to 4:1. The modern Western diet sits at 20:1 to 40:1 — almost entirely driven by seed oils added to processed food and restaurant cooking.',
      'Linoleic acid from seed oils embeds in cell membranes and LDL particles. Once oxidized (by heat, light, or free radicals in the body) it generates aldehydes like 4-HNE that damage arterial walls and initiate plaque.',
      'Ekberg\'s rule: if an oil was not available before 1900, don\'t eat it. This eliminates canola, soybean, corn, cottonseed, sunflower, safflower, and grapeseed oils. Acceptable fats: butter, ghee, tallow, lard, duck fat, coconut oil, olive oil, avocado oil.',
      'The damage accumulates slowly. A single restaurant meal cooked in seed oil is not a crisis. Years of daily exposure are. Reading labels is the highest-leverage habit — seed oils hide in sauces, dressings, chips, crackers, protein bars, and nearly all packaged food.',
    ],
  },
  {
    id: 'ekberg-electrolytes',
    title: 'Electrolytes on keto & fasting',
    summary:
      'Low insulin causes the kidneys to excrete sodium. Sodium loss pulls potassium and magnesium with it. Most "keto flu" is electrolyte depletion — not a fat adaptation problem.',
    body: [
      'When insulin drops, the kidneys stop retaining sodium. You can lose 1–2g of sodium per day in the first week of keto or extended fasting. Symptoms: headache, fatigue, muscle cramps, brain fog, heart palpitations.',
      'The fix is straightforward: 2,000–4,000 mg sodium, 1,000–3,500 mg potassium, and 300–500 mg magnesium daily. Bone broth is one of the best whole-food electrolyte sources. Pink salt in water works. Magnesium glycinate or malate absorbs better than oxide.',
      'Potassium-rich keto foods: avocado (975 mg per fruit), salmon, spinach, and Swiss chard. These are not afterthoughts — they are structural.',
      'Magnesium is a cofactor in over 300 enzymatic reactions including glucose metabolism and protein synthesis. Deficiency is common even outside keto. Signs: poor sleep, muscle twitches, constipation, anxiety. Ekberg prioritizes magnesium as the most critical mineral to supplement on a ketogenic protocol.',
    ],
  },
  {
    id: 'ekberg-root-cause',
    title: 'Root cause medicine: what Ekberg actually means',
    summary:
      'Most modern medicine manages symptoms with drugs. Ekberg\'s framework is to find the upstream driver — usually insulin, inflammation, or nutrient deficiency — and remove it.',
    body: [
      'Hypertension → treat with a pill. Or: ask why the blood vessels are inflamed and stiff. Usually the answer is insulin resistance, excess sodium relative to potassium, or endothelial damage from oxidized LDL. Fix the root cause and blood pressure normalizes.',
      'Ekberg\'s diagnostic questions: Is insulin high? (Order fasting insulin, not just glucose.) Is there systemic inflammation? (hs-CRP, IL-6.) Are there nutrient deficiencies? (B12, D, magnesium, zinc.) Is the gut leaky? (LPS, zonulin.)',
      'The body heals if the obstacle is removed. Fasting removes the insulin obstacle. Eliminating seed oils removes the oxidized fat obstacle. Eating organ meats removes the nutrient-deficiency obstacle. These are not complementary therapies — they are the therapy.',
      'Ekberg\'s framing: you are not treating disease. You are creating the conditions under which the body repairs itself. The doctor does not heal you. The body heals itself when you stop doing what broke it.',
    ],
  },
  {
    id: 'ekberg-stress-cortisol',
    title: 'Stress, cortisol & insulin resistance',
    summary:
      'Cortisol raises blood sugar — even when you haven\'t eaten. Chronic stress is a metabolic disease driver that no diet fully overcomes without addressing sleep and nervous system regulation.',
    body: [
      'Cortisol is a glucocorticoid — it mobilizes glucose for fight-or-flight. A stressed body maintains chronically elevated blood sugar and, in response, chronically elevated insulin. You can eat perfectly and still be insulin resistant if cortisol is high.',
      'Sleep debt is the most common unaddressed cortisol driver. One night of 4-hour sleep produces insulin resistance equivalent to a 6-month high-sugar diet. Ekberg treats sleep as the highest-leverage intervention after diet.',
      'Practical tools Ekberg recommends: 4-7-8 breathing before meals (activates parasympathetic), cold exposure (trains the stress response), time outdoors and barefoot (grounding reduces inflammatory markers), and eliminating blue light after dark.',
      'HRV (heart rate variability) is the best objective proxy for autonomic balance. A rising HRV trend on consecutive mornings means the nervous system is recovering. A falling trend means the stress load exceeds recovery — adjust training, sleep, or food window accordingly.',
    ],
  },
  {
    id: 'ekberg-anti-inflammatory-spices',
    title: 'Turmeric, ginger & cinnamon: the metabolic spices',
    summary:
      'Three spices Ekberg returns to repeatedly — each with direct mechanisms on insulin sensitivity and inflammation, not just flavor.',
    body: [
      'Turmeric (curcumin): inhibits NF-κB, the master switch for inflammatory gene expression. Bioavailability is low on its own — combine with black pepper (piperine increases absorption 20-fold) and fat. 1 tsp daily in food or a golden milk preparation is Ekberg\'s baseline.',
      'Ginger: inhibits prostaglandins and leukotrienes (the same pathway as NSAIDs, without the gut damage). Also delays gastric emptying, which blunts post-meal glucose spikes. Fresh ginger is more potent than dried. 1–2 inch piece per day in tea or cooking.',
      'Cinnamon: increases GLUT4 transporter expression on muscle cells — the same mechanism insulin uses to clear glucose. Studies show 1–3g per day reduces fasting blood sugar and improves insulin sensitivity in type 2 diabetics. Ceylon cinnamon is preferred over cassia (lower coumarin content).',
      'These are not supplements. They are foods. The goal is to use them daily in cooking rather than as pills — the food matrix slows absorption and reduces the risk of any single compound being overdosed.',
    ],
  },
];
