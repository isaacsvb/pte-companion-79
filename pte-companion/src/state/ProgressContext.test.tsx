import { describe, it, expect, beforeEach } from 'vitest';
import { act, render } from '@testing-library/react';
import { ProgressProvider, useProgress } from './ProgressContext';
import { createCard } from '../domain/srs';
import {
  XP_SRS_REVIEW,
  XP_STRATEGY_CHAPTER,
  XP_PLAN_ACTIVITY,
  XP_TASK_SESSION,
} from '../domain/gamification';
import type { ProgressContextValue } from './ProgressContext';

// Harness: captura o valor do contexto para dirigir mutações a partir dos testes.
function captureProgress(): { current: ProgressContextValue | null } {
  const ref: { current: ProgressContextValue | null } = { current: null };
  function Capture() {
    ref.current = useProgress();
    return null;
  }
  render(
    <ProgressProvider>
      <Capture />
    </ProgressProvider>,
  );
  return ref;
}

describe('ProgressContext — composição da gamificação (integração)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('upsertCard incrementa cardsReviewedTotal e concede XP', () => {
    const ref = captureProgress();
    const before = ref.current!.state.gamification;
    expect(before.cardsReviewedTotal).toBe(0);
    expect(before.xp).toBe(0);

    act(() => {
      ref.current!.upsertCard(createCard('m01-e01'));
    });

    const g = ref.current!.state.gamification;
    expect(g.cardsReviewedTotal).toBe(1);
    expect(g.xp).toBe(XP_SRS_REVIEW);
    // Cartão persistido no SRS.
    expect(ref.current!.state.srs['m01-e01']).toBeDefined();
  });

  it('desmarcar uma atividade do plano NÃO subtrai XP', () => {
    const ref = captureProgress();

    act(() => {
      ref.current!.startPlan('90-day');
      ref.current!.toggleActivity('90-day', 'a1', true);
    });
    const afterCheck = ref.current!.state.gamification.xp;
    expect(afterCheck).toBe(XP_PLAN_ACTIVITY);

    act(() => {
      ref.current!.toggleActivity('90-day', 'a1', false);
    });
    const afterUncheck = ref.current!.state.gamification.xp;
    // XP é monotônico: desmarcar não pune.
    expect(afterUncheck).toBe(afterCheck);
    // A atividade foi de fato desmarcada no estado.
    expect(ref.current!.state.plans['90-day'].doneActivities['a1']).toBe(false);
  });

  it('uma única ação premiadora avança a ofensiva exatamente uma vez', () => {
    const ref = captureProgress();
    expect(ref.current!.state.gamification.currentStreak).toBe(0);

    act(() => {
      ref.current!.toggleChapterRead('cap-1', true);
    });

    const g = ref.current!.state.gamification;
    expect(g.currentStreak).toBe(1);
    expect(g.longestStreak).toBe(1);
    expect(g.lastActiveDay).not.toBeNull();
    expect(g.xp).toBe(XP_STRATEGY_CHAPTER);
  });

  it('múltiplas ações premiadoras no mesmo dia não inflam a ofensiva', () => {
    const ref = captureProgress();

    act(() => {
      ref.current!.toggleChapterRead('cap-1', true);
      ref.current!.registerTaskSession('read-aloud');
      ref.current!.upsertCard(createCard('m01-e01'));
    });

    const g = ref.current!.state.gamification;
    // Ofensiva permanece em 1 (mesmo dia), mesmo com 3 ações premiadoras.
    expect(g.currentStreak).toBe(1);
    // Mas o XP soma de todas as ações.
    expect(g.xp).toBe(XP_STRATEGY_CHAPTER + XP_TASK_SESSION + XP_SRS_REVIEW);
  });

  it('desmarcar um capítulo lido não subtrai XP nem mexe na ofensiva', () => {
    const ref = captureProgress();

    act(() => {
      ref.current!.toggleChapterRead('cap-1', true);
    });
    const after = ref.current!.state.gamification;

    act(() => {
      ref.current!.toggleChapterRead('cap-1', false);
    });
    const g = ref.current!.state.gamification;
    expect(g.xp).toBe(after.xp);
    expect(g.currentStreak).toBe(after.currentStreak);
    expect(ref.current!.state.strategyRead['cap-1']).toBe(false);
  });
});
