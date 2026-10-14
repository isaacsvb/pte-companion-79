import { describe, it, expect } from 'vitest';
import {
  buildDashboardSummary,
  buildGamificationView,
  countMasteredCards,
  countCompletedVocabModules,
} from './dashboardSummary';
import { defaultState } from '../../storage/schema';
import type { StudyPlan, VocabModule } from '../../content/types';
import { createCard } from '../../domain/srs';

const plans: StudyPlan[] = [
  { id: '90-day', title: '90', description: '', days: [{ day: 1, activities: [{ id: 'a', label: 'A' }] }] },
];

const vocabModules: VocabModule[] = [
  {
    id: 'm01',
    index: 1,
    title: 'Módulo 1',
    entries: [
      { id: 'm01-e01', english: 'a', practicalPronunciation: 'a', translationPtBr: 'a' },
      { id: 'm01-e02', english: 'b', practicalPronunciation: 'b', translationPtBr: 'b' },
    ],
  },
];

describe('dashboardSummary', () => {
  const NOW = new Date('2024-01-10T12:00:00.000Z');

  it('estado vazio não tem atividade', () => {
    const s = buildDashboardSummary(defaultState(), plans, () => undefined, NOW, vocabModules);
    expect(s.hasAnyActivity).toBe(false);
    expect(s.dueToday).toBe(0);
    expect(s.tasksPracticed).toBe(0);
    expect(s.gamification.level.level).toBe(1);
    expect(s.gamification.currentStreak).toBe(0);
  });

  it('conta cartões vencidos hoje', () => {
    const state = defaultState();
    state.srs['e1'] = { ...createCard('e1', NOW), dueDate: NOW.toISOString() };
    const s = buildDashboardSummary(state, plans, () => 'module-01', NOW, vocabModules);
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
    const s = buildDashboardSummary(state, plans, () => undefined, NOW, vocabModules);
    expect(s.tasksPracticed).toBe(2);
    expect(s.lastPractice).toBe('2024-01-09T10:00:00.000Z');
  });

  it('reflete progresso dos planos', () => {
    const state = defaultState();
    state.plans['90-day'] = { startedAt: '2024-01-01T00:00:00.000Z', doneActivities: { a: true } };
    const s = buildDashboardSummary(state, plans, () => undefined, NOW, vocabModules);
    expect(s.plans[0].started).toBe(true);
    expect(s.plans[0].percent).toBe(100);
  });

  it('tem atividade quando há XP mesmo sem cartões', () => {
    const state = defaultState();
    state.gamification.xp = 20;
    const s = buildDashboardSummary(state, plans, () => undefined, NOW, vocabModules);
    expect(s.hasAnyActivity).toBe(true);
  });
});

describe('dashboardSummary — gamificação derivada', () => {
  it('deriva nível, XP e ofensiva do estado', () => {
    const state = defaultState();
    state.gamification.xp = 150;
    state.gamification.currentStreak = 3;
    state.gamification.longestStreak = 5;
    state.gamification.cardsReviewedTotal = 42;
    const view = buildGamificationView(state, vocabModules);
    expect(view.xp).toBe(150);
    expect(view.level.level).toBe(2);
    expect(view.currentStreak).toBe(3);
    expect(view.longestStreak).toBe(5);
    expect(view.cardsReviewedTotal).toBe(42);
  });

  it('conta cartões dominados (review com intervalo >= 21)', () => {
    const srs = {
      a: { ...createCard('a'), state: 'review' as const, intervalDays: 30 },
      b: { ...createCard('b'), state: 'learning' as const, intervalDays: 5 },
      c: { ...createCard('c'), state: 'review' as const, intervalDays: 10 },
    };
    expect(countMasteredCards(srs)).toBe(1);
  });

  it('conta módulos dominados somente quando todas as entradas estão dominadas', () => {
    // Apenas uma das duas entradas dominada → módulo não conta.
    const partial = {
      'm01-e01': { ...createCard('m01-e01'), state: 'review' as const, intervalDays: 30 },
    };
    expect(countCompletedVocabModules(partial, vocabModules)).toBe(0);

    // Ambas dominadas → módulo conta.
    const full = {
      'm01-e01': { ...createCard('m01-e01'), state: 'review' as const, intervalDays: 30 },
      'm01-e02': { ...createCard('m01-e02'), state: 'review' as const, intervalDays: 25 },
    };
    expect(countCompletedVocabModules(full, vocabModules)).toBe(1);
  });
});
