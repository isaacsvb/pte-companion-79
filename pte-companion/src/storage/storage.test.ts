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

  it('round-trip save/load preserva o estado', () => {
    const state = defaultState();
    state.strategyRead['cap1'] = true;
    state.taskSessions.push({ taskId: 'read-aloud', completedAt: '2024-01-01T00:00:00.000Z' });
    save(state);

    const result = load();
    expect(result.usingFallback).toBe(false);
    expect(result.recovered).toBe(false);
    expect(result.state.strategyRead['cap1']).toBe(true);
    expect(result.state.taskSessions).toHaveLength(1);
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
