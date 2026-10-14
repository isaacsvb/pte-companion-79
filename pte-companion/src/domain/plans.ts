// Lógica de progresso dos planos: dia atual e percentual concluído.

import type { StudyPlan } from '../content/types';

/** Dia atual do plano (1-indexado), limitado ao total de dias. null se não iniciado. */
export function currentDay(
  startedAt: string | null,
  totalDays: number,
  now: Date = new Date(),
): number | null {
  if (!startedAt) return null;
  const start = new Date(startedAt);
  const msPerDay = 24 * 60 * 60 * 1000;
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.floor((nowMidnight - startMidnight) / msPerDay);
  const day = diffDays + 1;
  if (day < 1) return 1;
  if (day > totalDays) return totalDays;
  return day;
}

export function totalActivities(plan: StudyPlan): number {
  return plan.days.reduce((sum, d) => sum + d.activities.length, 0);
}

export function completedCount(doneActivities: Record<string, boolean>): number {
  return Object.values(doneActivities).filter(Boolean).length;
}

export function progressPercent(plan: StudyPlan, doneActivities: Record<string, boolean>): number {
  const total = totalActivities(plan);
  if (total === 0) return 0;
  return Math.round((completedCount(doneActivities) / total) * 100);
}
