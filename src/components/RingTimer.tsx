import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/utils';

interface RingTimerProps {
  progress: number;
  primary: string;
  secondary: string;
  caption?: string;
  maxSize?: number;
}

export function RingTimer({ progress, primary, secondary, caption, maxSize = 260 }: RingTimerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(maxSize);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setSize(Math.min(maxSize, w));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [maxSize]);

  const stroke = size < 200 ? 10 : 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = clamp(progress, 0, 1);
  const dash = c * p;

  return (
    <div ref={ref} className="w-full">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="ring-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(148,163,184,0.15)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="url(#ring-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="font-display text-3xl sm:text-4xl tabular-nums tracking-tight text-white">{primary}</div>
          <div className="mt-1 text-xs sm:text-sm text-slate-300">{secondary}</div>
          {caption ? <div className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-snug">{caption}</div> : null}
        </div>
      </div>
    </div>
  );
}
