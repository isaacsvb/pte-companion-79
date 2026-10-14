import { describe, it, expect } from 'vitest';
import {
  createCard,
  reschedule,
  isDue,
  countStates,
  buildStudyQueue,
  MIN_EASE,
  DEFAULT_EASE,
} from './srs';

const NOW = new Date('2024-01-01T12:00:00.000Z');

describe('srs — reschedule (relógio injetável)', () => {
  it('cria cartão novo vencido imediatamente', () => {
    const c = createCard('e1', NOW);
    expect(c.state).toBe('new');
    expect(c.ease).toBe(DEFAULT_EASE);
    expect(isDue(c, NOW)).toBe(true);
  });

  it('"again" reduz ease, incrementa lapses e reagenda para 1 dia', () => {
    const c = createCard('e1', NOW);
    const r = reschedule(c, 'again', NOW);
    expect(r.lapses).toBe(1);
    expect(r.reps).toBe(0);
    expect(r.ease).toBeCloseTo(DEFAULT_EASE - 0.2, 5);
    expect(r.intervalDays).toBe(1);
    expect(r.state).toBe('learning');
    expect(new Date(r.dueDate).getTime()).toBe(
      new Date('2024-01-02T12:00:00.000Z').getTime(),
    );
  });

  it('"good" segue a progressão 1 → 6 → 6*ease', () => {
    let c = createCard('e1', NOW);
    c = reschedule(c, 'good', NOW); // 0 -> 1
    expect(c.intervalDays).toBe(1);
    c = reschedule(c, 'good', NOW); // 1 -> 6
    expect(c.intervalDays).toBe(6);
    const prevEase = c.ease;
    c = reschedule(c, 'good', NOW); // 6 -> round(6*ease)
    expect(c.intervalDays).toBe(Math.round(6 * prevEase));
  });

  it('"easy" aumenta ease e produz intervalo maior que "good"', () => {
    const base = createCard('e1', NOW);
    const good = reschedule(base, 'good', NOW);
    const easy = reschedule(base, 'easy', NOW);
    expect(easy.ease).toBeGreaterThan(base.ease);
    expect(easy.intervalDays).toBeGreaterThanOrEqual(good.intervalDays);
  });

  it('ease nunca cai abaixo do mínimo', () => {
    let c = createCard('e1', NOW);
    for (let i = 0; i < 20; i++) c = reschedule(c, 'again', NOW);
    expect(c.ease).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it('é imutável — não altera o cartão original', () => {
    const c = createCard('e1', NOW);
    const snapshot = { ...c };
    reschedule(c, 'good', NOW);
    expect(c).toEqual(snapshot);
  });
});

describe('srs — contadores e fila', () => {
  it('conta novos, em aprendizado e dominados', () => {
    const cards = [
      createCard('a', NOW),
      { ...createCard('b', NOW), state: 'learning' as const, intervalDays: 3 },
      { ...createCard('c', NOW), state: 'review' as const, intervalDays: 30 },
    ];
    const counts = countStates(cards);
    expect(counts.new).toBe(1);
    expect(counts.learning).toBe(1);
    expect(counts.mastered).toBe(1);
  });

  it('fila inclui vencidos e novos limitados por newLimit', () => {
    const existing = {
      due1: { ...createCard('due1', NOW), dueDate: NOW.toISOString(), state: 'review' as const },
      future: {
        ...createCard('future', NOW),
        dueDate: new Date('2030-01-01').toISOString(),
        state: 'review' as const,
      },
    };
    const queue = buildStudyQueue(existing, ['due1', 'future', 'new1', 'new2'], NOW, 1);
    const ids = queue.map((c) => c.entryId);
    expect(ids).toContain('due1');
    expect(ids).not.toContain('future');
    // Apenas 1 novo pelo limite.
    const newOnes = ids.filter((id) => id.startsWith('new'));
    expect(newOnes.length).toBe(1);
  });
});
