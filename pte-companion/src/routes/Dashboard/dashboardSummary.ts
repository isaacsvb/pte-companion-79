// Derivação do resumo do Dashboard a partir do ProgressState (lógica pura e testável).

import type { ProgressState } from '../../storage/schema';
import type { StudyPlan } from '../../content/types';
import { isDue } from '../../domain/srs';
import { progressPercent } from '../../domain/plans';

export interface DashboardSummary {
  dueToday: number;
  reviewedToday: number;
  modulesInProgress: number;
  tasksPracticed: number;
  lastPractice: string | null; // ISO
  chaptersRead: number;
  plans: { id: string; title: string; percent: number; started: boolean }[];
  hasAnyActivity: boolean;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildDashboardSummary(
  state: ProgressState,
  plans: StudyPlan[],
  moduleIdByEntryId: (entryId: string) => string | undefined,
  now: Date = new Date(),
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
    planSummaries.some((p) => p.started);

  return {
    dueToday,
    reviewedToday,
    modulesInProgress: moduleSet.size,
    tasksPracticed,
    lastPractice,
    chaptersRead,
    plans: planSummaries,
    hasAnyActivity,
  };
}
