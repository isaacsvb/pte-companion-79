import { describe, it, expect, beforeEach, vi } from 'vitest';
import { load, save, resetStorage, __clearMemoryStore } from './storage';
import { STORAGE_KEY, SCHEMA_VERSION, defaultState } from './schema';
import { exportToJson, importFromJson } from './exportImport';

describe('storage — localStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __clearMemoryStore();
    vi.restoreAllMocks();
  });

  it('round-trip save/load preserva o estado (incluindo gamificação)', () => {
    const state = defaultState();
    state.strategyRead['cap1'] = true;
    state.taskSessions.push({ taskId: 'read-aloud', completedAt: '2024-01-01T00:00:00.000Z' });
    state.gamification.xp = 125;
    state.gamification.currentStreak = 4;
    state.gamification.longestStreak = 9;
    state.gamification.cardsReviewedTotal = 37;
    state.gamification.unlockedAchievements['cards-100'] = '2024-01-01T00:00:00.000Z';
    save(state);

    const result = load();
    expect(result.usingFallback).toBe(false);
    expect(result.recovered).toBe(false);
    expect(result.state.strategyRead['cap1']).toBe(true);
    expect(result.state.taskSessions).toHaveLength(1);
    expect(result.state.gamification.xp).toBe(125);
    expect(result.state.gamification.currentStreak).toBe(4);
    expect(result.state.gamification.longestStreak).toBe(9);
    expect(result.state.gamification.cardsReviewedTotal).toBe(37);
    expect(result.state.gamification.unlockedAchievements['cards-100']).toBe(
      '2024-01-01T00:00:00.000Z',
    );
  });

  it('load sem dados retorna defaults', () => {
    const result = load();
    expect(result.state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.recovered).toBe(false);
  });

  it('dados corrompidos → reset seguro', () => {
    window.localStorage.setItem(STORAGE_KEY, '{isso não é json válido');
    const result = load();
    expect(result.recovered).toBe(true);
    expect(result.state).toEqual(defaultState());
  });

  it('estrutura inválida → reset seguro', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
    const result = load();
    expect(result.recovered).toBe(true);
  });

  it('migração preenche campos ausentes e normaliza a versão', () => {
    const partial = {
      schemaVersion: 0,
      srs: {},
      strategyRead: { x: true },
      templateFills: {},
      taskSessions: [],
      plans: {},
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(partial));
    const result = load();
    expect(result.recovered).toBe(false);
    expect(result.state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(result.state.strategyRead.x).toBe(true);
  });

  it('estado v1 sem gamification carrega sem recuperação e ganha defaults (schema 2)', () => {
    // Estado válido da versão 1: estrutura correta, porém SEM o campo gamification.
    const v1 = {
      schemaVersion: 1,
      srs: {},
      strategyRead: { cap1: true },
      templateFills: {},
      taskSessions: [{ taskId: 'read-aloud', completedAt: '2024-01-01T00:00:00.000Z' }],
      plans: {},
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v1));
    const result = load();
    // Deve ser aceito (não é lixo) → sem reset de segurança.
    expect(result.recovered).toBe(false);
    expect(result.state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(SCHEMA_VERSION).toBe(2);
    // Campos preservados.
    expect(result.state.strategyRead.cap1).toBe(true);
    expect(result.state.taskSessions).toHaveLength(1);
    // Gamificação preenchida com defaults.
    expect(result.state.gamification).toEqual({
      xp: 0,
      lastActiveDay: null,
      currentStreak: 0,
      longestStreak: 0,
      unlockedAchievements: {},
      cardsReviewedTotal: 0,
    });
  });

  it('migração é idempotente para gamification', () => {
    const state = defaultState();
    state.gamification.xp = 55;
    state.gamification.unlockedAchievements['first-task'] = '2024-02-02T00:00:00.000Z';
    save(state);
    const once = load().state;
    save(once);
    const twice = load().state;
    expect(twice.gamification).toEqual(once.gamification);
    expect(twice.gamification.xp).toBe(55);
    expect(twice.gamification.unlockedAchievements['first-task']).toBe('2024-02-02T00:00:00.000Z');
  });

  it('fallback em memória quando localStorage indisponível', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const result = load();
    expect(result.usingFallback).toBe(true);
    spy.mockRestore();
  });

  it('resetStorage grava defaults', () => {
    const state = defaultState();
    state.strategyRead['cap1'] = true;
    save(state);
    const fresh = resetStorage();
    expect(fresh.strategyRead).toEqual({});
    expect(load().state.strategyRead).toEqual({});
  });
});

describe('exportImport', () => {
  it('export/import faz round-trip', () => {
    const state = defaultState();
    state.strategyRead['cap1'] = true;
    const json = exportToJson(state);
    const imported = importFromJson(json);
    expect(imported.strategyRead['cap1']).toBe(true);
  });

  it('import rejeita JSON inválido', () => {
    expect(() => importFromJson('não é json')).toThrow();
  });

  it('import rejeita estrutura inválida', () => {
    expect(() => importFromJson(JSON.stringify({ foo: 1 }))).toThrow();
  });
});
