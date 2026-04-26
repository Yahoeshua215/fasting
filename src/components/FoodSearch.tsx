import { useMemo, useRef, useState } from 'react';
import type { FoodItem } from '@/lib/db';

interface FoodSearchProps {
  foodItems: FoodItem[];
  recentFoodIds: number[];
  onSelect: (food: FoodItem) => void;
}

export function FoodSearch({ foodItems, recentFoodIds, onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const recentFoods = useMemo(
    () =>
      recentFoodIds
        .slice(0, 6)
        .map(id => foodItems.find(f => f.id === id))
        .filter((f): f is FoodItem => Boolean(f)),
    [recentFoodIds, foodItems],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return foodItems
      .filter(f => f.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q);
        const bStarts = b.name.toLowerCase().startsWith(q);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);
  }, [query, foodItems]);

  function handleSelect(food: FoodItem) {
    setQuery('');
    onSelect(food);
    inputRef.current?.blur();
  }

  return (
    <div className="space-y-3">
      {recentFoods.length > 0 && !query && (
        <div>
          <div className="label mb-2">Recent</div>
          <div className="flex flex-wrap gap-2">
            {recentFoods.map(food => (
              <button
                key={food.id}
                className="btn-ghost rounded-full px-3 py-2 text-sm"
                onClick={() => handleSelect(food)}
              >
                {food.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search foods (chicken, salmon, blueberries…)"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base placeholder:text-slate-500 focus:border-cyan-700 focus:outline-none"
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {query && results.length === 0 && (
        <p className="text-sm text-slate-500">
          No match — use "+ Add custom" to add it with an AI estimate.
        </p>
      )}

      {results.length > 0 && (
        <ul className="space-y-1 overflow-y-auto max-h-64">
          {results.map(food => (
            <li key={food.id}>
              <button
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-left transition hover:border-cyan-700/50 hover:bg-slate-900"
                onClick={() => handleSelect(food)}
              >
                <div className="text-sm text-slate-100">{food.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {food.servingLabel} · {Math.round(food.protein)}g protein · {Math.round(food.calories)} cal
                  {food.source === 'usda' ? ' · USDA' : ''}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
