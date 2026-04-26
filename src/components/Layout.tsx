import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Disclaimer } from './Disclaimer';

export function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <NavBar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-3 sm:px-4 pb-24 pt-4 sm:pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <Disclaimer />
    </div>
  );
}
