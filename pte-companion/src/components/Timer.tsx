import { useEffect, useRef, useState } from 'react';
import {
  TimerConfig,
  TimerState,
  initTimer,
  start as startTimer,
  tick,
  skipPrep,
  finish,
  reset as resetTimer,
  formatSeconds,
} from '../domain/timers';
import { UI } from '../ui/strings';

interface Props {
  config: TimerConfig;
  onPhaseChange?: (phase: TimerState['phase']) => void;
  onResponseStart?: () => void;
  onDone?: () => void;
}

const PHASE_LABEL: Record<string, string> = {
  idle: '—',
  prep: UI.trainer.prepPhase,
  response: UI.trainer.responsePhase,
  done: UI.trainer.done,
};

export function Timer({ config, onPhaseChange, onResponseStart, onDone }: Props) {
  const [state, setState] = useState<TimerState>(() => initTimer(config));
  const intervalRef = useRef<number | null>(null);
  const prevPhase = useRef(state.phase);

  // Reinicia quando a config (tarefa) muda.
  useEffect(() => {
    setState(initTimer(config));
  }, [config]);

  useEffect(() => {
    if (prevPhase.current !== state.phase) {
      onPhaseChange?.(state.phase);
      if (state.phase === 'response') onResponseStart?.();
      if (state.phase === 'done') onDone?.();
      prevPhase.current = state.phase;
    }
  }, [state.phase, onPhaseChange, onResponseStart, onDone]);

  const running = state.phase === 'prep' || state.phase === 'response';

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setState((s) => tick(s, 1));
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, state.phase]);

  return (
    <div>
      <div className="phase-label">{PHASE_LABEL[state.phase]}</div>
      <div className="timer-display" aria-live="polite">
        {formatSeconds(state.remaining)}
      </div>
      <div className="row" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
        {state.phase === 'idle' && (
          <button className="primary" onClick={() => setState((s) => startTimer(s))}>
            {config.prepSeconds ? UI.trainer.startPrep : UI.trainer.startResponse}
          </button>
        )}
        {state.phase === 'prep' && (
          <button onClick={() => setState((s) => skipPrep(s))}>Pular preparação</button>
        )}
        {state.phase === 'response' && (
          <button onClick={() => setState((s) => finish(s))}>{UI.common.stop}</button>
        )}
        {(state.phase === 'done' || state.phase !== 'idle') && (
          <button onClick={() => setState((s) => resetTimer(s))}>{UI.common.reset}</button>
        )}
      </div>
    </div>
  );
}
