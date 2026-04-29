import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useFastStore } from './store/useFastStore';
import { Home } from './pages/Home';
import { Protocols } from './pages/Protocols';
import { Learn } from './pages/Learn';
import { Settings } from './pages/Settings';
import { Progress } from './pages/Progress';

export default function App() {
  const hydrate = useFastStore(s => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="protocols" element={<Protocols />} />
        <Route path="start" element={<Navigate to="/protocols" replace />} />
        <Route path="active" element={<Navigate to="/" replace />} />
        <Route path="learn" element={<Learn />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
