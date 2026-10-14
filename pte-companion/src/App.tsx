import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { UI } from './ui/strings';
import { useProgress } from './state/ProgressContext';
import { Dashboard } from './routes/Dashboard/Dashboard';
import { Strategy } from './routes/Strategy/Strategy';
import { Vocabulary } from './routes/Vocabulary/Vocabulary';
import { Templates } from './routes/Templates/Templates';
import { TaskTrainer } from './routes/TaskTrainer/TaskTrainer';
import { BattlePlan } from './routes/BattlePlan/BattlePlan';

const NAV = [
  { to: '/', label: UI.nav.dashboard, end: true },
  { to: '/estrategias', label: UI.nav.strategy },
  { to: '/vocabulario', label: UI.nav.vocabulary },
  { to: '/templates', label: UI.nav.templates },
  { to: '/treino', label: UI.nav.taskTrainer },
  { to: '/plano', label: UI.nav.battlePlan },
];

function Shell() {
  const { usingFallback } = useProgress();
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{UI.appName}</h1>
        <p>{UI.appTagline}</p>
      </header>
      <nav className="app-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      {usingFallback && <div className="warning-banner">{UI.storage.unavailableWarning}</div>}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estrategias" element={<Strategy />} />
          <Route path="/vocabulario" element={<Vocabulary />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/treino" element={<TaskTrainer />} />
          <Route path="/plano" element={<BattlePlan />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
