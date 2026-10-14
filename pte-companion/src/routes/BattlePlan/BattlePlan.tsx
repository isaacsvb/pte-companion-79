import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STUDY_PLANS } from '../../content/plans';
import { currentDay, progressPercent, totalActivities, completedCount } from '../../domain/plans';
import { useProgress } from '../../state/ProgressContext';
import { UI } from '../../ui/strings';

export function BattlePlan() {
  const { state, startPlan, toggleActivity } = useProgress();
  const navigate = useNavigate();
  const [planId, setPlanId] = useState(STUDY_PLANS[0].id);
  const plan = STUDY_PLANS.find((p) => p.id === planId)!;
  const planState = state.plans[planId];
  const day = currentDay(planState?.startedAt ?? null, plan.days.length);
  const done = planState?.doneActivities ?? {};
  const percent = progressPercent(plan, done);

  return (
    <div>
      <h2>{UI.nav.battlePlan}</h2>
      <div className="row" style={{ marginBottom: '1rem' }}>
        {STUDY_PLANS.map((p) => (
          <button
            key={p.id}
            className={p.id === planId ? 'primary' : ''}
            onClick={() => setPlanId(p.id)}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="card">
        <p>{plan.description}</p>
        {planState?.startedAt ? (
          <>
            <p className="badge">
              {UI.battlePlan.started}{' '}
              {new Date(planState.startedAt).toLocaleDateString('pt-BR')} ·{' '}
              <strong>
                {UI.battlePlan.currentDay}: {day}/{plan.days.length}
              </strong>
            </p>
            <div className="spread">
              <span className="badge">
                {UI.battlePlan.progress}: {completedCount(done)}/{totalActivities(plan)} ({percent}%)
              </span>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
          </>
        ) : (
          <>
            <p className="badge">{UI.battlePlan.notStarted}</p>
            <button className="primary" onClick={() => startPlan(planId)}>
              {UI.battlePlan.start}
            </button>
          </>
        )}
      </div>

      {planState?.startedAt &&
        plan.days.map((d) => {
          const isCurrent = d.day === day;
          return (
            <div
              className="card"
              key={d.day}
              style={isCurrent ? { borderColor: 'var(--primary)', borderWidth: 2 } : undefined}
            >
              <div className="spread">
                <strong>
                  {UI.common.day} {d.day}
                  {isCurrent ? ' · (dia atual)' : ''}
                </strong>
                {d.title && <span className="badge">{d.title}</span>}
              </div>
              <ul className="plain">
                {d.activities.map((a) => (
                  <li key={a.id} className="row" style={{ marginTop: '0.3rem' }}>
                    <input
                      type="checkbox"
                      checked={!!done[a.id]}
                      onChange={(e) => toggleActivity(planId, a.id, e.target.checked)}
                    />
                    <span>{a.label}</span>
                    {a.link && (
                      <button onClick={() => navigate(a.link!)}>{UI.battlePlan.goToSection}</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
    </div>
  );
}
