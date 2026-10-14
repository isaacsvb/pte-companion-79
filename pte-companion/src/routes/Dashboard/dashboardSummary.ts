// Derivação do resumo do Dashboard a partir do ProgressState (lógica pura e testável).

import type { ProgressState } from '../../storage/schema';
import type { StudyPlan, VocabModule } from '../../content/types';
import { isDue, type SrsCardState } from '../../domain/srs';
import { progressPercent } from '../../domain/plans';
import { levelFromXp, type LevelInfo } from '../../domain/gamification';

export interface GamificationView {
  xp: number;
  level: LevelInfo;
  currentStreak: number;
  longestStreak: number;
  cardsReviewedTotal: number;
  masteredCards: number;
  completedVocabModules: number;
  unlockedAchievements: Record<string, string>;
}

export interface DashboardSummary {
  dueToday: number;
  reviewedToday: number;
  modulesInProgress: number;
  tasksPracticed: number;
  lastPractice: string | null; // ISO
  chaptersRead: number;
  plans: { id: string; title: string; percent: number; started: boolean }[];
  hasAnyActivity: boolean;
  gamification: GamificationView;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Um cartão é "dominado" quando está em review com intervalo longo (>= 21 dias). */
function isMastered(card: SrsCardState): boolean {
  return card.state === 'review' && card.intervalDays >= 21;
}

/** Quantos cartões, no total, estão dominados. */
export function countMasteredCards(srs: Record<string, SrsCardState>): number {
  return Object.values(srs).filter(isMastered).length;
}

/**
 * Quantos módulos de vocabulário estão "dominados" (todos os seus cartões
 * foram iniciados e estão dominados). Pura: recebe os módulos como parâmetro.
 */
export function countCompletedVocabModules(
  srs: Record<string, SrsCardState>,
  modules: VocabModule[],
): number {
  let completed = 0;
  for (const m of modules) {
    if (m.entries.length === 0) continue;
    const allMastered = m.entries.every((e) => {
      const card = srs[e.id];
      return card ? isMastered(card) : false;
    });
    if (allMastered) completed += 1;
  }
  return completed;
}

/** Deriva a visão de gamificação pronta para a UI. */
export function buildGamificationView(
  state: ProgressState,
  modules: VocabModule[],
): GamificationView {
  const g = state.gamification;
  return {
    xp: g.xp,
    level: levelFromXp(g.xp),
    currentStreak: g.currentStreak,
    longestStreak: g.longestStreak,
    cardsReviewedTotal: g.cardsReviewedTotal,
    masteredCards: countMasteredCards(state.srs),
    completedVocabModules: countCompletedVocabModules(state.srs, modules),
    unlockedAchievements: g.unlockedAchievements,
  };
}

export function buildDashboardSummary(
  state: ProgressState,
  plans: StudyPlan[],
  moduleIdByEntryId: (entryId: string) => string | undefined,
  now: Date = new Date(),
  vocabModules: VocabModule[] = [],
): DashboardSummary {
  const cards = Object.values(state.srs);

  const dueToday = cards.filter((c) => isDue(c, now)).length;

  // Revisados hoje: cartões cuja última atualização (reflete na dueDate futura) começou hoje.
  // Aproximação: cartões com reps/lapses > 0 e dueDate no futuro agendado hoje.
  const reviewedToday = cards.filter((c) => {
    if (c.state === 'new') return false;
    const due = new Date(c.dueDate);
    // dueDate = now + intervalo no momento da revisão; se a revisão foi hoje, due - intervalo ~ hoje.
    const reviewedAt = new Date(due.getTime() - c.intervalDays * 24 * 60 * 60 * 1000);
    return sameDay(reviewedAt, now);
  }).length;

  const moduleSet = new Set<string>();
  for (const c of cards) {
    const mod = moduleIdByEntryId(c.entryId);
    if (mod) moduleSet.add(mod);
  }

  const tasksPracticed = state.taskSessions.length;
  const lastPractice =
    state.taskSessions.length > 0
      ? state.taskSessions.reduce(
          (latest, s) => (s.completedAt > latest ? s.completedAt : latest),
          state.taskSessions[0].completedAt,
        )
      : null;

  const chaptersRead = Object.values(state.strategyRead).filter(Boolean).length;

  const planSummaries = plans.map((p) => {
    const ps = state.plans[p.id];
    return {
      id: p.id,
      title: p.title,
      percent: ps ? progressPercent(p, ps.doneActivities) : 0,
      started: !!ps?.startedAt,
    };
  });

  const hasAnyActivity =
    cards.length > 0 ||
    tasksPracticed > 0 ||
    chaptersRead > 0 ||
    planSummaries.some((p) => p.started) ||
    state.gamification.xp > 0;

  return {
    dueToday,
    reviewedToday,
    modulesInProgress: moduleSet.size,
    tasksPracticed,
    lastPractice,
    chaptersRead,
    plans: planSummaries,
    hasAnyActivity,
    gamification: buildGamificationView(state, vocabModules),
  };
}
