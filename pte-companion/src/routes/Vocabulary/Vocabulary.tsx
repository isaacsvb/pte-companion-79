import { useMemo, useState } from 'react';
import { VOCAB_MODULES, ALL_VOCAB_ENTRIES } from '../../content/vocabulary';
import {
  SrsRating,
  buildStudyQueue,
  countStates,
  createCard,
  reschedule,
} from '../../domain/srs';
import { useProgress } from '../../state/ProgressContext';
import { UI } from '../../ui/strings';
import type { VocabEntry } from '../../content/types';

type SessionMode = { type: 'module'; moduleId: string } | { type: 'due' } | null;

function Counts() {
  const { state } = useProgress();
  const cards = Object.values(state.srs);
  const counts = countStates(cards);
  const totalStudiable = ALL_VOCAB_ENTRIES.length;
  const newRemaining = totalStudiable - cards.length + counts.new;
  return (
    <div className="row">
      <span className="pill neutral">
        {UI.srs.newCards}: {Math.max(newRemaining, 0)}
      </span>
      <span className="pill neutral">
        {UI.srs.learning}: {counts.learning}
      </span>
      <span className="pill gold">
        {UI.srs.mastered}: {counts.mastered}
      </span>
    </div>
  );
}

function entryById(id: string): VocabEntry | undefined {
  return ALL_VOCAB_ENTRIES.find((e) => e.id === id);
}

function FlashcardSession({ queue, onEnd }: { queue: string[]; onEnd: () => void }) {
  const { state, upsertCard } = useProgress();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (index >= queue.length) {
    return (
      <div className="card">
        <p>{UI.srs.sessionDone}</p>
        <button className="primary" onClick={onEnd}>
          {UI.common.back}
        </button>
      </div>
    );
  }

  const entryId = queue[index];
  const entry = entryById(entryId);
  if (!entry) {
    // Pula entradas inexistentes (defensivo).
    setIndex((i) => i + 1);
    return null;
  }

  function rate(rating: SrsRating) {
    const existing = state.srs[entryId] ?? createCard(entryId);
    upsertCard(reschedule(existing, rating));
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="card">
      <p className="badge">
        {index + 1} / {queue.length}
      </p>
      <div className="flashcard">
        <div className="front">{entry.english}</div>
        {revealed && (
          <div>
            <p>
              <strong>{UI.srs.pronunciation}:</strong> {entry.practicalPronunciation}
            </p>
            <p>
              <strong>{UI.srs.translation}:</strong> {entry.translationPtBr}
            </p>
          </div>
        )}
      </div>
      {!revealed ? (
        <button className="primary" onClick={() => setRevealed(true)}>
          {UI.srs.reveal}
        </button>
      ) : (
        <div className="row">
          <button onClick={() => rate('again')}>{UI.srs.again}</button>
          <button onClick={() => rate('hard')}>{UI.srs.hard}</button>
          <button className="primary" onClick={() => rate('good')}>
            {UI.srs.good}
          </button>
          <button onClick={() => rate('easy')}>{UI.srs.easy}</button>
        </div>
      )}
    </div>
  );
}

export function Vocabulary() {
  const { state } = useProgress();
  const [session, setSession] = useState<SessionMode>(null);

  const dueQueue = useMemo(
    () => buildStudyQueue(state.srs, ALL_VOCAB_ENTRIES.map((e) => e.id)).map((c) => c.entryId),
    [state.srs],
  );

  if (session) {
    const queue =
      session.type === 'due'
        ? dueQueue
        : VOCAB_MODULES.find((m) => m.id === session.moduleId)?.entries.map((e) => e.id) ?? [];
    if (queue.length === 0) {
      return (
        <div className="page">
          <h2 className="page-title">{UI.nav.vocabulary}</h2>
          <p className="notice">{UI.srs.noDueCards}</p>
          <button onClick={() => setSession(null)}>{UI.common.back}</button>
        </div>
      );
    }
    return (
      <div className="page">
        <h2 className="page-title">{UI.nav.vocabulary}</h2>
        <FlashcardSession queue={queue} onEnd={() => setSession(null)} />
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">{UI.nav.vocabulary}</h2>
      <div className="card">
        <div className="spread">
          <Counts />
          <button className="primary" onClick={() => setSession({ type: 'due' })}>
            {UI.srs.studyDue} ({dueQueue.length})
          </button>
        </div>
      </div>
      <div className="grid">
        {VOCAB_MODULES.map((m) => (
          <div className="card" key={m.id}>
            <div className="spread">
              <strong>
                {String(m.index).padStart(2, '0')}. {m.title}
              </strong>
            </div>
            {m.pending ? (
              <p className="pending">{UI.common.pending}</p>
            ) : (
              <>
                <p className="badge">{m.entries.length} entradas</p>
                <button onClick={() => setSession({ type: 'module', moduleId: m.id })}>
                  {UI.srs.studyModule}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
