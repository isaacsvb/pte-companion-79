import { useMemo, useState } from 'react';
import { TASKS, TASKS_BY_PART, PART_LABELS } from '../../content/tasks';
import { Timer } from '../../components/Timer';
import { WordCounter } from '../../components/WordCounter';
import { AudioRecorder } from '../../components/AudioRecorder';
import { useProgress } from '../../state/ProgressContext';
import { UI } from '../../ui/strings';
import type { PteTask } from '../../content/types';

function TaskRunner({ task, onBack }: { task: PteTask; onBack: () => void }) {
  const { registerTaskSession } = useProgress();
  const [phase, setPhase] = useState<string>('idle');
  const [text, setText] = useState('');
  const [registered, setRegistered] = useState(false);

  const config = useMemo(
    () => ({ prepSeconds: task.prepSeconds, responseSeconds: task.responseSeconds }),
    [task.prepSeconds, task.responseSeconds],
  );

  const inResponseOrDone = phase === 'response' || phase === 'done';

  return (
    <div>
      <button onClick={onBack}>{UI.common.back}</button>
      <div className="card">
        <div className="spread">
          <h3 style={{ margin: 0 }}>{task.name}</h3>
          <span className={`pill ${task.tier}`}>
            {task.tier === 'gold' ? 'OURO' : task.tier === 'junk' ? 'LIXO' : 'NEUTRA'}
          </span>
        </div>
        <p>{task.description}</p>
        <p className="badge">
          {UI.trainer.prepTime}: {task.prepSeconds ?? 0}s · {UI.trainer.responseTime}:{' '}
          {task.responseSeconds}s{task.wordRule ? ` · ${task.wordRule}` : ''}
        </p>

        <Timer
          config={config}
          onPhaseChange={setPhase}
        />

        {task.requiresMic && inResponseOrDone && (
          <div style={{ marginTop: '1rem' }}>
            <AudioRecorder />
          </div>
        )}

        {task.isWriting && (
          <div style={{ marginTop: '1rem' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite sua resposta aqui…"
            />
            <WordCounter text={text} limit={task.wordLimit} />
          </div>
        )}

        <p className="notice" style={{ marginTop: '1rem' }}>
          {UI.trainer.noAutoScore}
        </p>

        <div className="row">
          <button
            className="primary"
            onClick={() => {
              registerTaskSession(task.id);
              setRegistered(true);
            }}
          >
            {UI.trainer.completeSession}
          </button>
          {registered && <span className="count-ok">{UI.trainer.sessionRegistered}</span>}
        </div>
      </div>
    </div>
  );
}

export function TaskTrainer() {
  const [selected, setSelected] = useState<PteTask | null>(null);

  if (selected) {
    return (
      <div className="page">
        <h2 className="page-title">{UI.nav.taskTrainer}</h2>
        <TaskRunner task={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">{UI.nav.taskTrainer}</h2>
      <p className="notice">{UI.trainer.noAutoScore}</p>
      {(['speaking', 'writing', 'reading', 'listening'] as const).map((part) => (
        <div key={part}>
          <h3>{PART_LABELS[part]}</h3>
          <div className="grid">
            {(TASKS_BY_PART[part] ?? []).map((task) => (
              <div className="card" key={task.id}>
                <div className="spread">
                  <strong>{task.name}</strong>
                  <span className={`pill ${task.tier}`}>
                    {task.tier === 'gold' ? 'OURO' : task.tier === 'junk' ? 'LIXO' : 'NEUTRA'}
                  </span>
                </div>
                <p className="badge">{task.timing}</p>
                {task.requiresMic && <span className="badge">🎙 Gravação de voz</span>}
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="primary" onClick={() => setSelected(task)}>
                    {UI.common.start}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="badge">{`Total: ${TASKS.length} tarefas oficiais pontuadas (+ Personal Introduction de aquecimento).`}</p>
    </div>
  );
}
