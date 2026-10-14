import { useState } from 'react';
import { STRATEGY_CHAPTERS } from '../../content/strategy';
import { TASKS } from '../../content/tasks';
import { Markdown } from '../../components/Markdown';
import { useProgress } from '../../state/ProgressContext';
import { UI } from '../../ui/strings';
import type { TaskTier } from '../../content/types';

function TierMatrix() {
  const groups: Record<TaskTier, typeof TASKS> = { gold: [], junk: [], neutral: [] };
  for (const t of TASKS) groups[t.tier].push(t);

  const section = (tier: TaskTier, title: string) => (
    <div className="card">
      <h3>
        <span className={`pill ${tier}`}>
          {tier === 'gold' ? 'OURO' : tier === 'junk' ? 'LIXO' : 'NEUTRA'}
        </span>{' '}
        {title}
      </h3>
      <ul>
        {groups[tier].map((t) => (
          <li key={t.id}>
            {t.name} <span className="badge">({t.timing})</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <h2>Matriz 80/20</h2>
      {section('gold', UI.strategy.matrixGold)}
      {section('junk', UI.strategy.matrixJunk)}
      {section('neutral', UI.strategy.matrixNeutral)}
    </div>
  );
}

export function Strategy() {
  const chapters = [...STRATEGY_CHAPTERS].sort((a, b) => a.order - b.order);
  const [selectedId, setSelectedId] = useState<string>(chapters[0]?.id ?? '');
  const { state, toggleChapterRead } = useProgress();
  const selected = chapters.find((c) => c.id === selectedId);

  return (
    <div className="page">
      <h2 className="page-title">{UI.nav.strategy}</h2>
      <div className="two-pane">
        <div>
          <ul className="plain">
            {chapters.map((c) => {
              const isRead = !!state.strategyRead[c.id];
              return (
                <li key={c.id} style={{ marginBottom: '0.3rem' }}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className={c.id === selectedId ? 'primary' : ''}
                    style={{ width: '100%', textAlign: 'left' }}
                  >
                    {isRead ? '✓ ' : ''}
                    {c.title}
                  </button>
                </li>
              );
            })}
          </ul>
          <TierMatrix />
        </div>
        <div className="card">
          {selected ? (
            <>
              <div className="spread">
                <h3 style={{ margin: 0 }}>{selected.title}</h3>
                <label className="row">
                  <input
                    type="checkbox"
                    checked={!!state.strategyRead[selected.id]}
                    onChange={(e) => toggleChapterRead(selected.id, e.target.checked)}
                  />
                  {state.strategyRead[selected.id] ? UI.common.markedAsRead : UI.common.markAsRead}
                </label>
              </div>
              <Markdown source={selected.bodyMarkdown} />
            </>
          ) : (
            <p className="pending">{UI.common.pending}</p>
          )}
        </div>
      </div>
    </div>
  );
}
