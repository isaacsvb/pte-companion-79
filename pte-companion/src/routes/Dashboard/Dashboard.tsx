import { useRef, useState } from 'react';
import { useProgress } from '../../state/ProgressContext';
import { STUDY_PLANS } from '../../content/plans';
import { getModuleOfEntry } from '../../content/vocabulary';
import { downloadProgress } from '../../storage/exportImport';
import { buildDashboardSummary } from './dashboardSummary';
import { UI } from '../../ui/strings';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
      <div className="badge">{label}</div>
    </div>
  );
}

export function Dashboard() {
  const { state, reset, importJson } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const summary = buildDashboardSummary(
    state,
    STUDY_PLANS,
    (entryId) => getModuleOfEntry(entryId)?.id,
  );

  function handleReset() {
    if (window.confirm(UI.dashboard.resetConfirm)) {
      reset();
      setMessage(null);
    }
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      importJson(text);
      setMessage(UI.dashboard.importSuccess);
    } catch {
      setMessage(UI.dashboard.importError);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <h2>{UI.dashboard.title}</h2>

      {!summary.hasAnyActivity && <p className="notice">{UI.dashboard.noActivityYet}</p>}

      <div className="grid">
        <StatCard label={UI.dashboard.cardsDueToday} value={summary.dueToday} />
        <StatCard label={UI.dashboard.cardsReviewedToday} value={summary.reviewedToday} />
        <StatCard label={UI.dashboard.modulesInProgress} value={summary.modulesInProgress} />
        <StatCard label={UI.dashboard.tasksPracticed} value={summary.tasksPracticed} />
        <StatCard label={UI.dashboard.chaptersRead} value={summary.chaptersRead} />
        <StatCard
          label={UI.dashboard.lastPractice}
          value={
            summary.lastPractice
              ? new Date(summary.lastPractice).toLocaleDateString('pt-BR')
              : UI.common.none
          }
        />
      </div>

      <div className="card">
        <h3>{UI.dashboard.plansProgress}</h3>
        {summary.plans.map((p) => (
          <div key={p.id} style={{ marginBottom: '0.6rem' }}>
            <div className="spread">
              <span>{p.title}</span>
              <span className="badge">{p.started ? `${p.percent}%` : UI.battlePlan.notStarted}</span>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${p.percent}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Dados e progresso</h3>
        <div className="row">
          <button onClick={() => downloadProgress(state)}>{UI.dashboard.exportData}</button>
          <button onClick={handleImportClick}>{UI.dashboard.importData}</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          <button className="danger" onClick={handleReset}>
            {UI.dashboard.resetData}
          </button>
        </div>
        {message && <p className="notice">{message}</p>}
      </div>
    </div>
  );
}
