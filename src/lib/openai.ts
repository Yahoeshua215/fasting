import type { FoodItem } from './db';

const OPENAI_KEY_STORAGE = 'fasting.openai.apiKey';

interface OpenAIMessage {
  role: 'system' | 'user';
  content: string;
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface MacroEstimate {
  name: string;
  servingLabel: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

export function getOpenAiApiKey(): string {
  return localStorage.getItem(OPENAI_KEY_STORAGE) ?? '';
}

export function setOpenAiApiKey(apiKey: string): void {
  localStorage.setItem(OPENAI_KEY_STORAGE, apiKey.trim());
}

export async function estimateMacros(description: string): Promise<Omit<FoodItem, 'id'>> {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error('Add your OpenAI API key in Settings first.');
  }

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content:
        'You are a nutrition assistant. Return only JSON with fields: name, servingLabel, protein, fat, carbs, calories. Use a realistic single serving for common eating-tracker usage. All numeric values should be grams except calories.',
    },
    {
      role: 'user',
      content: `Estimate nutrition for: ${description}`,
    },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status})`);
  }

  const json = (await response.json()) as OpenAIResponse;
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error('OpenAI returned an empty response.');

  const parsed = JSON.parse(raw) as MacroEstimate;
  if (!parsed.name || !parsed.servingLabel) {
    throw new Error('OpenAI response missing required fields.');
  }

  return {
    name: parsed.name.trim(),
    servingLabel: parsed.servingLabel.trim(),
    measurementOptions: [{ label: parsed.servingLabel.trim(), multiplier: 1 }],
    protein: Math.max(0, Number(parsed.protein) || 0),
    fat: Math.max(0, Number(parsed.fat) || 0),
    carbs: Math.max(0, Number(parsed.carbs) || 0),
    calories: Math.max(0, Number(parsed.calories) || 0),
    builtIn: false,
  };
}
