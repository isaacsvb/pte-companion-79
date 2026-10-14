import { useRef, useState } from 'react';
import { useProgress } from '../../state/ProgressContext';
import { STUDY_PLANS } from '../../content/plans';
import { getModuleOfEntry, VOCAB_MODULES } from '../../content/vocabulary';
import { STRATEGY_CHAPTERS } from '../../content/strategy';
import { downloadProgress } from '../../storage/exportImport';
import { buildDashboardSummary, type GamificationView } from './dashboardSummary';
import { ACHIEVEMENTS } from '../../domain/gamification';
import { UI } from '../../ui/strings';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
      <div className="badge">{label}</div>
    </div>
  );
}

function LevelCard({ g }: { g: GamificationView }) {
  const { level } = g;
  return (
    <div className="card hero-card">
      <div className="spread">
        <div className="level-badge">
          <span className="level-badge-label">{UI.gamification.level}</span>
          <span className="level-badge-value">{level.level}</span>
        </div>
        <div style={{ flex: 1, marginLeft: '1rem' }}>
          <div className="spread">
            <strong>{UI.gamification.xp}</strong>
            <span className="badge">
              {level.xpIntoLevel} / {level.xpForNextLevel} {UI.gamification.xp}
            </span>
          </div>
          <div className="progress-bar xp-bar">
            <span style={{ width: `${level.progressPercent}%` }} />
          </div>
          <div className="badge" style={{ marginTop: '0.3rem' }}>
            {UI.gamification.xp} total: {g.xp}
          </div>
        </div>
      </div>
    </div>
  );
}

function StreakCard({ g }: { g: GamificationView }) {
  const active = g.currentStreak > 0;
  return (
    <div className="card streak-card">
      <div className="row">
        <span className={`streak-flame${active ? ' on' : ''}`}>🔥</span>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            {g.currentStreak} <span className="badge">{UI.gamification.streakDays}</span>
          </div>
          <div className="badge">{UI.gamification.streak}</div>
        </div>
      </div>
      <div className="badge" style={{ marginTop: '0.4rem' }}>
        {UI.gamification.streakBest}: {g.longestStreak}
      </div>
      {!active && <p className="notice">{UI.gamification.streakKeepGoing}</p>}
    </div>
  );
}

function GoalBar({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div className="spread">
        <span>{label}</span>
        <span className="badge">
          {value}/{total} ({percent}%)
        </span>
      </div>
      <div className="progress-bar goal-bar">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function AchievementsGrid({ unlocked }: { unlocked: Record<string, string> }) {
  const unlockedCount = Object.keys(unlocked).length;
  return (
    <div className="card">
      <div className="spread">
        <h3 style={{ margin: 0 }}>{UI.gamification.achievements}</h3>
        <span className="badge">
          {unlockedCount}/{ACHIEVEMENTS.length} {UI.gamification.achievementsUnlocked}
        </span>
      </div>
      <div className="achievements-grid">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = !!unlocked[a.id];
          return (
            <div
              key={a.id}
              className={`achievement-tile${isUnlocked ? ' unlocked' : ' locked'}`}
              title={a.description}
            >
              <span className="achievement-icon">{isUnlocked ? a.icon : '🔒'}</span>
              <strong className="achievement-title">{a.title}</strong>
              <span className="badge">{a.description}</span>
              <span className={`pill ${isUnlocked ? 'gold' : 'neutral'}`}>
                {isUnlocked ? UI.gamification.unlocked : UI.gamification.locked}
              </span>
            </div>
          );
        })}
      </div>
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
    new Date(),
    VOCAB_MODULES,
  );
  const g = summary.gamification;
  const avgPlanPercent =
    summary.plans.length > 0
      ? Math.round(summary.plans.reduce((sum, p) => sum + p.percent, 0) / summary.plans.length)
      : 0;

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
    <div className="page">
      <h2 className="page-title">{UI.dashboard.title}</h2>

      {!summary.hasAnyActivity && <p className="notice">{UI.dashboard.noActivityYet}</p>}

      <div className="two-pane">
        <LevelCard g={g} />
        <StreakCard g={g} />
      </div>

      <div className="grid">
        <StatCard label={UI.dashboard.cardsDueToday} value={summary.dueToday} />
        <StatCard label={UI.dashboard.cardsReviewedToday} value={summary.reviewedToday} />
        <StatCard label={UI.gamification.cardsReviewedTotal} value={g.cardsReviewedTotal} />
        <StatCard label={UI.gamification.masteredCards} value={g.masteredCards} />
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
        <h3>{UI.gamification.goalsTitle}</h3>
        <GoalBar
          label={UI.gamification.goalVocab}
          value={g.completedVocabModules}
          total={VOCAB_MODULES.length}
        />
        <GoalBar
          label={UI.gamification.goalChapters}
          value={summary.chaptersRead}
          total={STRATEGY_CHAPTERS.length}
        />
        <GoalBar label={UI.gamification.goalTasks} value={summary.tasksPracticed} total={22} />
        <GoalBar label={UI.gamification.goalPlans} value={avgPlanPercent} total={100} />
        <p className="notice">{UI.gamification.goalHint}</p>
      </div>

      <AchievementsGrid unlocked={g.unlockedAchievements} />

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
