// Algoritmo de repetição espaçada — SM-2 simplificado estilo Anki.
// Relógio injetável (parâmetro `now`) para testes determinísticos.

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';
export type SrsCardStatus = 'new' | 'learning' | 'review';

export interface SrsCardState {
  entryId: string;
  ease: number; // fator de facilidade (SM-2); mínimo 1.3
  intervalDays: number; // intervalo atual em dias
  dueDate: string; // ISO date (yyyy-mm-dd...) da próxima revisão
  reps: number; // repetições corretas consecutivas
  lapses: number; // número de vezes que o usuário errou ("again")
  state: SrsCardStatus;
}

export const MIN_EASE = 1.3;
export const DEFAULT_EASE = 2.5;

/** Cria o estado inicial de um cartão novo, vencido imediatamente (due = agora). */
export function createCard(entryId: string, now: Date = new Date()): SrsCardState {
  return {
    entryId,
    ease: DEFAULT_EASE,
    intervalDays: 0,
    dueDate: toIsoDate(now),
    reps: 0,
    lapses: 0,
    state: 'new',
  };
}

function toIsoDate(d: Date): string {
  return d.toISOString();
}

function addDays(now: Date, days: number): Date {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function clampEase(ease: number): number {
  return Math.max(MIN_EASE, Number(ease.toFixed(2)));
}

/**
 * Reagenda um cartão com base na avaliação do usuário.
 * Retorna um NOVO objeto (imutável) — não altera o original.
 */
export function reschedule(
  card: SrsCardState,
  rating: SrsRating,
  now: Date = new Date(),
): SrsCardState {
  let { ease, intervalDays, reps, lapses } = card;
  let state: SrsCardStatus;

  switch (rating) {
    case 'again': {
      // Errou: zera progresso, reduz ease, volta para aprendizado (revisar em ~1 dia).
      lapses += 1;
      reps = 0;
      ease = clampEase(ease - 0.2);
      intervalDays = 1;
      state = 'learning';
      break;
    }
    case 'hard': {
      reps += 1;
      ease = clampEase(ease - 0.15);
      intervalDays = card.intervalDays <= 0 ? 1 : Math.max(1, Math.round(card.intervalDays * 1.2));
      state = intervalDays >= 21 ? 'review' : 'learning';
      break;
    }
    case 'good': {
      reps += 1;
      if (card.intervalDays <= 0) intervalDays = 1;
      else if (card.intervalDays === 1) intervalDays = 6;
      else intervalDays = Math.round(card.intervalDays * ease);
      state = intervalDays >= 21 ? 'review' : 'learning';
      break;
    }
    case 'easy': {
      reps += 1;
      ease = clampEase(ease + 0.15);
      if (card.intervalDays <= 0) intervalDays = 4;
      else intervalDays = Math.round(card.intervalDays * ease * 1.3);
      state = intervalDays >= 21 ? 'review' : 'learning';
      break;
    }
  }

  return {
    ...card,
    ease,
    intervalDays,
    reps,
    lapses,
    state,
    dueDate: toIsoDate(addDays(now, intervalDays)),
  };
}

/** Um cartão está vencido se dueDate <= agora. */
export function isDue(card: SrsCardState, now: Date = new Date()): boolean {
  return new Date(card.dueDate).getTime() <= now.getTime();
}

export interface SrsCounts {
  new: number;
  learning: number;
  mastered: number;
}

/** "Dominado" = em review com intervalo longo (>= 21 dias). */
export function countStates(cards: SrsCardState[]): SrsCounts {
  const counts: SrsCounts = { new: 0, learning: 0, mastered: 0 };
  for (const c of cards) {
    if (c.state === 'new') counts.new += 1;
    else if (c.state === 'review' && c.intervalDays >= 21) counts.mastered += 1;
    else counts.learning += 1;
  }
  return counts;
}

/**
 * Monta a fila de estudo: todos os cartões vencidos (existentes) + novos (até newLimit).
 * `existing` são os estados persistidos; `allEntryIds` é o universo de entradas estudáveis.
 */
export function buildStudyQueue(
  existing: Record<string, SrsCardState>,
  allEntryIds: string[],
  now: Date = new Date(),
  newLimit = 20,
): SrsCardState[] {
  const due: SrsCardState[] = [];
  const fresh: SrsCardState[] = [];

  for (const id of allEntryIds) {
    const card = existing[id];
    if (card) {
      if (isDue(card, now)) due.push(card);
    } else if (fresh.length < newLimit) {
      fresh.push(createCard(id, now));
    }
  }
  return [...due, ...fresh];
}
