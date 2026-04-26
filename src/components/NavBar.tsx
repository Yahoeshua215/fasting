import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Now', end: true },
  { to: '/protocols', label: 'Protocols' },
  { to: '/eating', label: 'Eating' },
  { to: '/training', label: 'Train' },
  { to: '/learn', label: 'Learn' },
  { to: '/labs', label: 'Labs' },
  { to: '/settings', label: 'Settings' },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-ink-950/80 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        <NavLink to="/" className="flex shrink-0 items-center gap-2 font-display text-base font-semibold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent shadow-glow" />
          Fasting
        </NavLink>
        <nav className="ml-auto flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-lg px-2.5 py-1.5 transition',
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
