import { describe, it, expect } from 'vitest';
import { currentDay, progressPercent, totalActivities } from './plans';
import type { StudyPlan } from '../content/types';

const plan: StudyPlan = {
  id: '90-day',
  title: 'teste',
  description: '',
  days: [
    { day: 1, activities: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] },
    { day: 2, activities: [{ id: 'c', label: 'C' }] },
  ],
};

describe('plans — dia atual e progresso', () => {
  it('retorna null quando não iniciado', () => {
    expect(currentDay(null, 90)).toBeNull();
  });

  it('dia 1 no dia de início', () => {
    const start = '2024-01-01T10:00:00.000Z';
    const now = new Date('2024-01-01T20:00:00.000Z');
    expect(currentDay(start, 90, now)).toBe(1);
  });

  it('calcula a diferença de dias', () => {
    const start = '2024-01-01T10:00:00.000Z';
    const now = new Date('2024-01-05T10:00:00.000Z');
    expect(currentDay(start, 90, now)).toBe(5);
  });

  it('limita ao total de dias', () => {
    const start = '2024-01-01T10:00:00.000Z';
    const now = new Date('2024-12-31T10:00:00.000Z');
    expect(currentDay(start, 90, now)).toBe(90);
  });

  it('conta atividades totais e percentual', () => {
    expect(totalActivities(plan)).toBe(3);
    expect(progressPercent(plan, {})).toBe(0);
    expect(progressPercent(plan, { a: true, b: false })).toBe(33);
    expect(progressPercent(plan, { a: true, b: true, c: true })).toBe(100);
  });
});
