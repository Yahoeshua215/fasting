/**
 * Curated food catalog sourced from USDA FoodData Central.
 * All macros are per 100g of the food as listed.
 * Serving sizes include real gram weights for accurate macro math.
 */

export type FoodCategory =
  | 'protein'
  | 'dairy'
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'nuts'
  | 'fats'
  | 'other';

export interface UsdaServing {
  label: string;
  grams: number;
  isDefault?: boolean;
}

export interface UsdaFood {
  name: string;
  category: FoodCategory;
  per100g: {
    protein: number;
    fat: number;
    carbs: number;
    calories: number;
    fiber?: number;
    sodium?: number;
    sugar?: number;
  };
  servings: UsdaServing[];
}

export const USDA_FOODS: UsdaFood[] = [
  // ── Proteins ────────────────────────────────────────────────────────────
  {
    name: 'Chicken breast',
    category: 'protein',
    per100g: { protein: 31, fat: 3.6, carbs: 0, calories: 165, fiber: 0, sodium: 74 },
    servings: [
      { label: '3 oz (85g)', grams: 85 },
      { label: '4 oz (113g)', grams: 113, isDefault: true },
      { label: '6 oz (170g)', grams: 170 },
      { label: '8 oz (227g)', grams: 227 },
    ],
  },
  {
    name: 'Salmon',
    category: 'protein',
    per100g: { protein: 25, fat: 12, carbs: 0, calories: 208, fiber: 0, sodium: 59 },
    servings: [
      { label: '3 oz (85g)', grams: 85 },
      { label: '4 oz (113g)', grams: 113, isDefault: true },
      { label: '6 oz (170g)', grams: 170 },
      { label: '8 oz (227g)', grams: 227 },
    ],
  },
  {
    name: 'Tuna (canned in water)',
    category: 'protein',
    per100g: { protein: 29, fat: 0.5, carbs: 0, calories: 128, sodium: 320 },
    servings: [
      { label: '2 oz (56g)', grams: 56 },
      { label: '3 oz (85g)', grams: 85, isDefault: true },
      { label: '5 oz can (142g)', grams: 142 },
    ],
  },
  {
    name: 'Eggs',
    category: 'protein',
    per100g: { protein: 12.6, fat: 10.6, carbs: 0.6, calories: 155, sodium: 124 },
    servings: [
      { label: '1 egg (50g)', grams: 50 },
      { label: '2 eggs (100g)', grams: 100, isDefault: true },
      { label: '3 eggs (150g)', grams: 150 },
      { label: '4 eggs (200g)', grams: 200 },
    ],
  },
  {
    name: 'Ground beef (85% lean)',
    category: 'protein',
    per100g: { protein: 26, fat: 15, carbs: 0, calories: 245, sodium: 77 },
    servings: [
      { label: '3 oz (85g)', grams: 85 },
      { label: '4 oz (113g)', grams: 113, isDefault: true },
      { label: '6 oz (170g)', grams: 170 },
    ],
  },
  {
    name: 'Steak (sirloin, lean)',
    category: 'protein',
    per100g: { protein: 27, fat: 8, carbs: 0, calories: 190, sodium: 60 },
    servings: [
      { label: '3 oz (85g)', grams: 85 },
      { label: '6 oz (170g)', grams: 170, isDefault: true },
      { label: '8 oz (227g)', grams: 227 },
    ],
  },
  {
    name: 'Turkey breast',
    category: 'protein',
    per100g: { protein: 30, fat: 1.7, carbs: 0, calories: 135, sodium: 68 },
    servings: [
      { label: '3 oz (85g)', grams: 85 },
      { label: '4 oz (113g)', grams: 113, isDefault: true },
      { label: '6 oz (170g)', grams: 170 },
    ],
  },
  {
    name: 'Shrimp',
    category: 'protein',
    per100g: { protein: 21, fat: 1.1, carbs: 0.9, calories: 99, sodium: 111 },
    servings: [
      { label: '3 oz (85g)', grams: 85, isDefault: true },
      { label: '6 oz (170g)', grams: 170 },
    ],
  },
  {
    name: 'Pork tenderloin',
    category: 'protein',
    per100g: { protein: 26, fat: 2.7, carbs: 0, calories: 143, sodium: 62 },
    servings: [
      { label: '3 oz (85g)', grams: 85 },
      { label: '4 oz (113g)', grams: 113, isDefault: true },
      { label: '6 oz (170g)', grams: 170 },
    ],
  },
  {
    name: 'Beef stick / jerky',
    category: 'protein',
    per100g: { protein: 33, fat: 15, carbs: 3, calories: 275, sodium: 1900 },
    servings: [
      { label: '1 stick (28g)', grams: 28, isDefault: true },
      { label: '2 sticks (56g)', grams: 56 },
    ],
  },

  // ── Dairy ────────────────────────────────────────────────────────────────
  {
    name: 'Greek yogurt (plain, nonfat)',
    category: 'dairy',
    per100g: { protein: 10, fat: 0.4, carbs: 3.6, calories: 59, sugar: 3.2 },
    servings: [
      { label: '1/4 cup (61g)', grams: 61 },
      { label: '1/2 cup (122g)', grams: 122 },
      { label: '3/4 cup (183g)', grams: 183, isDefault: true },
      { label: '1 cup (245g)', grams: 245 },
    ],
  },
  {
    name: 'Yogurt (whole milk, plain)',
    category: 'dairy',
    per100g: { protein: 5.7, fat: 4.7, carbs: 7.7, calories: 97, sugar: 7.7 },
    servings: [
      { label: '1/4 cup (61g)', grams: 61 },
      { label: '1/2 cup (122g)', grams: 122 },
      { label: '3/4 cup (183g)', grams: 183 },
      { label: '1 cup (245g)', grams: 245, isDefault: true },
    ],
  },
  {
    name: 'Cottage cheese (2%)',
    category: 'dairy',
    per100g: { protein: 11, fat: 2.6, carbs: 3.4, calories: 82, sodium: 321 },
    servings: [
      { label: '1/4 cup (57g)', grams: 57 },
      { label: '1/2 cup (113g)', grams: 113, isDefault: true },
      { label: '1 cup (226g)', grams: 226 },
    ],
  },
  {
    name: 'Whole milk',
    category: 'dairy',
    per100g: { protein: 3.4, fat: 3.7, carbs: 4.8, calories: 61, sugar: 5.1 },
    servings: [
      { label: '1/2 cup (120ml)', grams: 122 },
      { label: '1 cup (240ml)', grams: 244, isDefault: true },
      { label: '2 cups (480ml)', grams: 488 },
    ],
  },
  {
    name: 'Cheddar cheese',
    category: 'dairy',
    per100g: { protein: 25, fat: 33, carbs: 1.3, calories: 402, sodium: 621 },
    servings: [
      { label: '1 slice (28g)', grams: 28 },
      { label: '1 oz (28g)', grams: 28, isDefault: true },
      { label: '2 oz (56g)', grams: 56 },
    ],
  },
  {
    name: 'Kefir (plain)',
    category: 'dairy',
    per100g: { protein: 3.6, fat: 3.5, carbs: 4.5, calories: 60 },
    servings: [
      { label: '1/2 cup (120ml)', grams: 122 },
      { label: '1 cup (240ml)', grams: 244, isDefault: true },
    ],
  },
  {
    name: 'Whey protein powder',
    category: 'dairy',
    per100g: { protein: 75, fat: 5, carbs: 10, calories: 370 },
    servings: [
      { label: '1 scoop (28g)', grams: 28, isDefault: true },
      { label: '1.5 scoops (42g)', grams: 42 },
      { label: '2 scoops (56g)', grams: 56 },
    ],
  },

  // ── Vegetables ──────────────────────────────────────────────────────────
  {
    name: 'Broccoli',
    category: 'vegetables',
    per100g: { protein: 2.8, fat: 0.4, carbs: 6.6, calories: 34, fiber: 2.6 },
    servings: [
      { label: '1/2 cup (46g)', grams: 46 },
      { label: '1 cup (91g)', grams: 91, isDefault: true },
      { label: '2 cups (182g)', grams: 182 },
    ],
  },
  {
    name: 'Spinach (raw)',
    category: 'vegetables',
    per100g: { protein: 2.9, fat: 0.4, carbs: 3.6, calories: 23, fiber: 2.2, sodium: 79 },
    servings: [
      { label: '1 cup (30g)', grams: 30, isDefault: true },
      { label: '2 cups (60g)', grams: 60 },
      { label: '3 cups (90g)', grams: 90 },
    ],
  },
  {
    name: 'Sweet potato (baked)',
    category: 'vegetables',
    per100g: { protein: 2, fat: 0.1, carbs: 20.7, calories: 90, fiber: 3.3 },
    servings: [
      { label: '1/2 medium (75g)', grams: 75 },
      { label: '1 medium (150g)', grams: 150, isDefault: true },
      { label: '1 large (200g)', grams: 200 },
    ],
  },
  {
    name: 'Avocado',
    category: 'vegetables',
    per100g: { protein: 2, fat: 14.7, carbs: 8.5, calories: 160, fiber: 6.7 },
    servings: [
      { label: '1/4 avocado (50g)', grams: 50 },
      { label: '1/2 avocado (100g)', grams: 100, isDefault: true },
      { label: '1 whole (200g)', grams: 200 },
    ],
  },
  {
    name: 'Kale (raw)',
    category: 'vegetables',
    per100g: { protein: 4.3, fat: 0.9, carbs: 8.8, calories: 49, fiber: 3.6 },
    servings: [
      { label: '1 cup chopped (21g)', grams: 21 },
      { label: '2 cups (42g)', grams: 42, isDefault: true },
    ],
  },
  {
    name: 'Bell pepper',
    category: 'vegetables',
    per100g: { protein: 0.9, fat: 0.3, carbs: 6, calories: 26, fiber: 2.1 },
    servings: [
      { label: '1/2 pepper (75g)', grams: 75 },
      { label: '1 medium (150g)', grams: 150, isDefault: true },
    ],
  },
  {
    name: 'Mushrooms (cooked)',
    category: 'vegetables',
    per100g: { protein: 3.6, fat: 0.4, carbs: 4.4, calories: 28, fiber: 2.2 },
    servings: [
      { label: '1/2 cup (78g)', grams: 78 },
      { label: '1 cup (156g)', grams: 156, isDefault: true },
    ],
  },
  {
    name: 'Sauerkraut',
    category: 'vegetables',
    per100g: { protein: 0.9, fat: 0.1, carbs: 4.3, calories: 19, fiber: 2.9, sodium: 661 },
    servings: [
      { label: '1/4 cup (35g)', grams: 35 },
      { label: '1/2 cup (71g)', grams: 71, isDefault: true },
    ],
  },
  {
    name: 'Kimchi',
    category: 'vegetables',
    per100g: { protein: 1.1, fat: 0.5, carbs: 4, calories: 15, fiber: 2, sodium: 498 },
    servings: [
      { label: '1/4 cup (38g)', grams: 38 },
      { label: '1/2 cup (75g)', grams: 75, isDefault: true },
    ],
  },
  {
    name: 'Cucumber',
    category: 'vegetables',
    per100g: { protein: 0.7, fat: 0.1, carbs: 3.6, calories: 15, fiber: 0.5 },
    servings: [
      { label: '1/2 cup sliced (52g)', grams: 52 },
      { label: '1 cup sliced (104g)', grams: 104, isDefault: true },
    ],
  },

  // ── Fruits ──────────────────────────────────────────────────────────────
  {
    name: 'Blueberries',
    category: 'fruits',
    per100g: { protein: 0.7, fat: 0.3, carbs: 14.5, calories: 57, fiber: 2.4, sugar: 10 },
    servings: [
      { label: '1/4 cup (37g)', grams: 37 },
      { label: '1/2 cup (74g)', grams: 74 },
      { label: '3/4 cup (111g)', grams: 111, isDefault: true },
      { label: '1 cup (148g)', grams: 148 },
    ],
  },
  {
    name: 'Strawberries',
    category: 'fruits',
    per100g: { protein: 0.7, fat: 0.3, carbs: 7.7, calories: 32, fiber: 2, sugar: 4.9 },
    servings: [
      { label: '1/2 cup (76g)', grams: 76 },
      { label: '1 cup (152g)', grams: 152, isDefault: true },
    ],
  },
  {
    name: 'Banana',
    category: 'fruits',
    per100g: { protein: 1.1, fat: 0.3, carbs: 22.8, calories: 89, fiber: 2.6, sugar: 12.2 },
    servings: [
      { label: '1/2 banana (60g)', grams: 60 },
      { label: '1 medium (118g)', grams: 118, isDefault: true },
    ],
  },
  {
    name: 'Apple',
    category: 'fruits',
    per100g: { protein: 0.3, fat: 0.2, carbs: 13.8, calories: 52, fiber: 2.4, sugar: 10.4 },
    servings: [
      { label: '1/2 medium (91g)', grams: 91 },
      { label: '1 medium (182g)', grams: 182, isDefault: true },
    ],
  },

  // ── Grains ──────────────────────────────────────────────────────────────
  {
    name: 'Rice (white, cooked)',
    category: 'grains',
    per100g: { protein: 2.7, fat: 0.3, carbs: 28.2, calories: 130, fiber: 0.4 },
    servings: [
      { label: '1/4 cup (49g)', grams: 49 },
      { label: '1/2 cup (99g)', grams: 99 },
      { label: '3/4 cup (148g)', grams: 148, isDefault: true },
      { label: '1 cup (186g)', grams: 186 },
    ],
  },
  {
    name: 'Oats (dry rolled)',
    category: 'grains',
    per100g: { protein: 16.9, fat: 6.9, carbs: 66.3, calories: 389, fiber: 10.6 },
    servings: [
      { label: '1/4 cup (20g)', grams: 20 },
      { label: '1/3 cup (27g)', grams: 27 },
      { label: '1/2 cup (40g)', grams: 40, isDefault: true },
      { label: '1 cup (81g)', grams: 81 },
    ],
  },
  {
    name: 'Quinoa (cooked)',
    category: 'grains',
    per100g: { protein: 4.4, fat: 1.9, carbs: 21.3, calories: 120, fiber: 2.8 },
    servings: [
      { label: '1/4 cup (43g)', grams: 43 },
      { label: '1/2 cup (86g)', grams: 86 },
      { label: '3/4 cup (130g)', grams: 130, isDefault: true },
      { label: '1 cup (170g)', grams: 170 },
    ],
  },
  {
    name: 'Whole wheat bread',
    category: 'grains',
    per100g: { protein: 12.9, fat: 4, carbs: 42.5, calories: 247, fiber: 6.1, sodium: 471 },
    servings: [
      { label: '1 slice (32g)', grams: 32, isDefault: true },
      { label: '2 slices (64g)', grams: 64 },
    ],
  },
  {
    name: 'Cereal (corn flakes)',
    category: 'grains',
    per100g: { protein: 7.5, fat: 0.4, carbs: 84.4, calories: 357, sodium: 728 },
    servings: [
      { label: '1/2 cup (15g)', grams: 15 },
      { label: '3/4 cup (28g)', grams: 28, isDefault: true },
      { label: '1 cup (28g)', grams: 28 },
    ],
  },

  // ── Nuts & Seeds ─────────────────────────────────────────────────────────
  {
    name: 'Almonds',
    category: 'nuts',
    per100g: { protein: 21.2, fat: 49.9, carbs: 21.6, calories: 579, fiber: 12.5 },
    servings: [
      { label: '1 tbsp (9g)', grams: 9 },
      { label: '1 oz / ~23 almonds (28g)', grams: 28, isDefault: true },
      { label: '2 oz (56g)', grams: 56 },
    ],
  },
  {
    name: 'Walnuts',
    category: 'nuts',
    per100g: { protein: 15.2, fat: 65.2, carbs: 13.7, calories: 654, fiber: 6.7 },
    servings: [
      { label: '1 oz / ~14 halves (28g)', grams: 28, isDefault: true },
      { label: '2 oz (56g)', grams: 56 },
    ],
  },
  {
    name: 'Chia seeds',
    category: 'nuts',
    per100g: { protein: 16.5, fat: 30.7, carbs: 42.1, calories: 486, fiber: 34.4 },
    servings: [
      { label: '1 tbsp (12g)', grams: 12 },
      { label: '2 tbsp (24g)', grams: 24, isDefault: true },
    ],
  },
  {
    name: 'Peanut butter',
    category: 'nuts',
    per100g: { protein: 25.1, fat: 50.4, carbs: 19.6, calories: 598, fiber: 6, sodium: 429 },
    servings: [
      { label: '1 tbsp (16g)', grams: 16 },
      { label: '2 tbsp (32g)', grams: 32, isDefault: true },
    ],
  },

  // ── Fats & Oils ──────────────────────────────────────────────────────────
  {
    name: 'Olive oil',
    category: 'fats',
    per100g: { protein: 0, fat: 100, carbs: 0, calories: 884 },
    servings: [
      { label: '1 tsp (4g)', grams: 4 },
      { label: '1 tbsp (14g)', grams: 14, isDefault: true },
      { label: '2 tbsp (28g)', grams: 28 },
    ],
  },
  {
    name: 'Butter',
    category: 'fats',
    per100g: { protein: 0.9, fat: 81.1, carbs: 0.1, calories: 717, sodium: 643 },
    servings: [
      { label: '1 pat (5g)', grams: 5 },
      { label: '1 tbsp (14g)', grams: 14, isDefault: true },
    ],
  },
];

/** Convert a USDA food entry to the FoodItem shape used in IndexedDB. */
export function usdaToFoodItem(food: UsdaFood): Omit<import('./db').FoodItem, 'id'> {
  const defaultServing = food.servings.find(s => s.isDefault) ?? food.servings[0];
  const per = food.per100g;
  const g = defaultServing.grams;
  const scale = g / 100;

  return {
    name: food.name,
    servingLabel: defaultServing.label,
    measurementOptions: food.servings.map(s => ({
      label: s.label,
      multiplier: s.grams / g,
      grams: s.grams,
    })),
    per100g: {
      protein: per.protein,
      fat: per.fat,
      carbs: per.carbs,
      calories: per.calories,
      fiber: per.fiber,
      sodium: per.sodium,
      sugar: per.sugar,
    },
    protein: Math.round(per.protein * scale * 10) / 10,
    fat: Math.round(per.fat * scale * 10) / 10,
    carbs: Math.round(per.carbs * scale * 10) / 10,
    calories: Math.round(per.calories * scale),
    builtIn: true,
    source: 'usda' as const,
  };
}
