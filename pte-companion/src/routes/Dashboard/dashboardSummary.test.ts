import { describe, it, expect } from 'vitest';
import { buildDashboardSummary } from './dashboardSummary';
import { defaultState } from '../../storage/schema';
import type { StudyPlan } from '../../content/types';
import { createCard } from '../../domain/srs';

const plans: StudyPlan[] = [
  { id: '90-day', title: '90', description: '', days: [{ day: 1, activities: [{ id: 'a', label: 'A' }] }] },
];

describe('dashboardSummary', () => {
  const NOW = new Date('2024-01-10T12:00:00.000Z');

  it('estado vazio não tem atividade', () => {
    const s = buildDashboardSummary(defaultState(), plans, () => undefined, NOW);
    expect(s.hasAnyActivity).toBe(false);
    expect(s.dueToday).toBe(0);
    expect(s.tasksPracticed).toBe(0);
  });

  it('conta cartões vencidos hoje', () => {
    const state = defaultState();
    state.srs['e1'] = { ...createCard('e1', NOW), dueDate: NOW.toISOString() };
    const s = buildDashboardSummary(state, plans, () => 'module-01', NOW);
    expect(s.dueToday).toBe(1);
    expect(s.modulesInProgress).toBe(1);
    expect(s.hasAnyActivity).toBe(true);
  });

  it('conta tarefas praticadas e última data', () => {
    const state = defaultState();
    state.taskSessions.push(
      { taskId: 'read-aloud', completedAt: '2024-01-08T10:00:00.000Z' },
      { taskId: 'write-essay', completedAt: '2024-01-09T10:00:00.000Z' },
    );
    const s = buildDashboardSummary(state, plans, () => undefined, NOW);
    expect(s.tasksPracticed).toBe(2);
    expect(s.lastPractice).toBe('2024-01-09T10:00:00.000Z');
  });

  it('reflete progresso dos planos', () => {
    const state = defaultState();
    state.plans['90-day'] = { startedAt: '2024-01-01T00:00:00.000Z', doneActivities: { a: true } };
    const s = buildDashboardSummary(state, plans, () => undefined, NOW);
    expect(s.plans[0].started).toBe(true);
    expect(s.plans[0].percent).toBe(100);
  });
});
