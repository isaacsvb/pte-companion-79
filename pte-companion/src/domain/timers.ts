// Máquina de estados do timer de treino: idle → prep → response → done.
// Lógica pura e testável; a UI chama tick()/start()/skip() com um relógio injetável.

export type TimerPhase = 'idle' | 'prep' | 'response' | 'done';

export interface TimerConfig {
  prepSeconds: number | null; // null = sem fase de preparação
  responseSeconds: number;
}

export interface TimerState {
  phase: TimerPhase;
  /** segundos restantes na fase atual (prep/response são regressivos). */
  remaining: number;
  config: TimerConfig;
}

export function initTimer(config: TimerConfig): TimerState {
  return { phase: 'idle', remaining: 0, config };
}

/** Inicia o treino: vai para prep se houver, senão direto para response. */
export function start(state: TimerState): TimerState {
  const { prepSeconds, responseSeconds } = state.config;
  if (prepSeconds && prepSeconds > 0) {
    return { ...state, phase: 'prep', remaining: prepSeconds };
  }
  return { ...state, phase: 'response', remaining: responseSeconds };
}

/**
 * Avança o relógio em `deltaSeconds`. Faz a transição automática
 * prep→response quando a preparação zera, e response→done quando a resposta zera.
 */
export function tick(state: TimerState, deltaSeconds = 1): TimerState {
  if (state.phase === 'idle' || state.phase === 'done') return state;

  const remaining = state.remaining - deltaSeconds;

  if (state.phase === 'prep') {
    if (remaining <= 0) {
      // Transição automática para a resposta; carrega o excedente de tempo.
      const overflow = -remaining;
      const responseRemaining = state.config.responseSeconds - overflow;
      if (responseRemaining <= 0) {
        return { ...state, phase: 'done', remaining: 0 };
      }
      return { ...state, phase: 'response', remaining: responseRemaining };
    }
    return { ...state, remaining };
  }

  // phase === 'response'
  if (remaining <= 0) {
    return { ...state, phase: 'done', remaining: 0 };
  }
  return { ...state, remaining };
}

/** Pula a fase de preparação, indo direto para a resposta. */
export function skipPrep(state: TimerState): TimerState {
  if (state.phase !== 'prep') return state;
  return { ...state, phase: 'response', remaining: state.config.responseSeconds };
}

/** Finaliza manualmente (ex.: usuário terminou antes). */
export function finish(state: TimerState): TimerState {
  return { ...state, phase: 'done', remaining: 0 };
}

export function reset(state: TimerState): TimerState {
  return initTimer(state.config);
}

/** Formata segundos como mm:ss. */
export function formatSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
