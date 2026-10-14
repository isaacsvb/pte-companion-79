import { describe, it, expect } from 'vitest';
import {
  levelFromXp,
  awardXp,
  updateStreak,
  toDayKey,
  evaluateAchievements,
  ACHIEVEMENTS,
  XP_LEVEL_BASE,
  type AchievementContext,
} from './gamification';

describe('gamification — níveis e XP', () => {
  it('nível 1 com 0 XP', () => {
    const info = levelFromXp(0);
    expect(info.level).toBe(1);
    expect(info.xpIntoLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(XP_LEVEL_BASE);
    expect(info.progressPercent).toBe(0);
  });

  it('fronteira: exatamente 100 XP leva ao nível 2', () => {
    const info = levelFromXp(XP_LEVEL_BASE);
    expect(info.level).toBe(2);
    expect(info.xpIntoLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(XP_LEVEL_BASE * 2);
  });

  it('99 XP ainda é nível 1 com progresso parcial', () => {
    const info = levelFromXp(99);
    expect(info.level).toBe(1);
    expect(info.xpIntoLevel).toBe(99);
    expect(info.progressPercent).toBe(99);
  });

  it('acumula corretamente para o nível 3 (100 + 200)', () => {
    const info = levelFromXp(300);
    expect(info.level).toBe(3);
    expect(info.xpIntoLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(XP_LEVEL_BASE * 3);
  });

  it('é monotônico: nível nunca diminui conforme o XP cresce', () => {
    let lastLevel = 0;
    for (let xp = 0; xp <= 2000; xp += 37) {
      const { level } = levelFromXp(xp);
      expect(level).toBeGreaterThanOrEqual(lastLevel);
      lastLevel = level;
    }
  });

  it('XP negativo é tratado como 0', () => {
    expect(levelFromXp(-50).level).toBe(1);
  });

  it('awardXp soma e nunca fica negativo', () => {
    expect(awardXp(10, 5)).toBe(15);
    expect(awardXp(0, 20)).toBe(20);
    expect(awardXp(10, -100)).toBe(10);
    expect(awardXp(-5, 5)).toBe(5);
  });
});

describe('gamification — ofensiva (relógio injetável)', () => {
  const NOW = new Date('2024-03-10T12:00:00');

  it('mesmo dia não altera a ofensiva', () => {
    const prev = { lastActiveDay: toDayKey(NOW), currentStreak: 4, longestStreak: 9 };
    const next = updateStreak(prev, NOW);
    expect(next.currentStreak).toBe(4);
    expect(next.lastActiveDay).toBe(toDayKey(NOW));
    expect(next.longestStreak).toBe(9);
  });

  it('dia consecutivo incrementa em 1', () => {
    const yesterday = new Date('2024-03-09T20:00:00');
    const prev = { lastActiveDay: toDayKey(yesterday), currentStreak: 4, longestStreak: 4 };
    const next = updateStreak(prev, NOW);
    expect(next.currentStreak).toBe(5);
    expect(next.lastActiveDay).toBe(toDayKey(NOW));
    expect(next.longestStreak).toBe(5);
  });

  it('lacuna reinicia a ofensiva em 1 (preserva o recorde)', () => {
    const prev = { lastActiveDay: '2024-03-01', currentStreak: 10, longestStreak: 10 };
    const next = updateStreak(prev, NOW);
    expect(next.currentStreak).toBe(1);
    expect(next.lastActiveDay).toBe(toDayKey(NOW));
    expect(next.longestStreak).toBe(10);
  });

  it('null (primeiro estudo) começa em 1', () => {
    const prev = { lastActiveDay: null, currentStreak: 0, longestStreak: 0 };
    const next = updateStreak(prev, NOW);
    expect(next.currentStreak).toBe(1);
    expect(next.longestStreak).toBe(1);
    expect(next.lastActiveDay).toBe(toDayKey(NOW));
  });

  it('toDayKey formata yyyy-mm-dd local', () => {
    expect(toDayKey(new Date('2024-01-05T08:00:00'))).toBe('2024-01-05');
  });
});

describe('gamification — conquistas', () => {
  const NOW = new Date('2024-03-10T12:00:00');

  const baseCtx: AchievementContext = {
    cardsReviewedTotal: 0,
    currentStreak: 0,
    longestStreak: 0,
    tasksPracticed: 0,
    chaptersRead: 0,
    masteredCards: 0,
    completedVocabModules: 0,
    xp: 0,
    level: 1,
  };

  function find(id: string) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) throw new Error(`conquista ${id} não encontrada`);
    return a;
  }

  it('primeiro treino: true somente com >= 1 tarefa', () => {
    expect(find('first-task').predicate({ ...baseCtx, tasksPracticed: 0 })).toBe(false);
    expect(find('first-task').predicate({ ...baseCtx, tasksPracticed: 1 })).toBe(true);
  });

  it('primeiro capítulo', () => {
    expect(find('first-chapter').predicate({ ...baseCtx, chaptersRead: 0 })).toBe(false);
    expect(find('first-chapter').predicate({ ...baseCtx, chaptersRead: 1 })).toBe(true);
  });

  it('100 cartões revisados', () => {
    expect(find('cards-100').predicate({ ...baseCtx, cardsReviewedTotal: 99 })).toBe(false);
    expect(find('cards-100').predicate({ ...baseCtx, cardsReviewedTotal: 100 })).toBe(true);
  });

  it('500 cartões revisados', () => {
    expect(find('cards-500').predicate({ ...baseCtx, cardsReviewedTotal: 499 })).toBe(false);
    expect(find('cards-500').predicate({ ...baseCtx, cardsReviewedTotal: 500 })).toBe(true);
  });

  it('7 dias de ofensiva (usa longestStreak)', () => {
    expect(find('streak-7').predicate({ ...baseCtx, longestStreak: 6 })).toBe(false);
    expect(find('streak-7').predicate({ ...baseCtx, longestStreak: 7 })).toBe(true);
  });

  it('30 dias de ofensiva', () => {
    expect(find('streak-30').predicate({ ...baseCtx, longestStreak: 29 })).toBe(false);
    expect(find('streak-30').predicate({ ...baseCtx, longestStreak: 30 })).toBe(true);
  });

  it('módulo de vocabulário dominado', () => {
    expect(find('vocab-module-mastered').predicate({ ...baseCtx, completedVocabModules: 0 })).toBe(false);
    expect(find('vocab-module-mastered').predicate({ ...baseCtx, completedVocabModules: 1 })).toBe(true);
  });

  it('nível 5', () => {
    expect(find('level-5').predicate({ ...baseCtx, level: 4 })).toBe(false);
    expect(find('level-5').predicate({ ...baseCtx, level: 5 })).toBe(true);
  });

  it('evaluateAchievements retorna novas conquistas e exclui as já desbloqueadas', () => {
    const ctx: AchievementContext = {
      ...baseCtx,
      tasksPracticed: 1,
      chaptersRead: 1,
      cardsReviewedTotal: 100,
    };
    const first = evaluateAchievements(ctx, {}, NOW);
    expect(first.newlyUnlocked).toEqual(
      expect.arrayContaining(['first-task', 'first-chapter', 'cards-100']),
    );

    const already = { 'first-task': NOW.toISOString() };
    const second = evaluateAchievements(ctx, already, NOW);
    expect(second.newlyUnlocked).not.toContain('first-task');
    expect(second.newlyUnlocked).toEqual(
      expect.arrayContaining(['first-chapter', 'cards-100']),
    );
  });

  it('evaluateAchievements não retorna nada quando nenhum predicado é satisfeito', () => {
    const res = evaluateAchievements(baseCtx, {}, NOW);
    expect(res.newlyUnlocked).toEqual([]);
  });
});
