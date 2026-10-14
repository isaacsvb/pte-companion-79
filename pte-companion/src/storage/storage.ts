// Camada de persistência: localStorage com fallback em memória e reset seguro.

import {
  ProgressState,
  STORAGE_KEY,
  defaultState,
  isValidState,
  migrate,
} from './schema';

export interface LoadResult {
  state: ProgressState;
  /** true quando localStorage NÃO está disponível (fallback em memória). */
  usingFallback: boolean;
  /** true quando os dados estavam corrompidos e foram reinicializados. */
  recovered: boolean;
}

let memoryStore: string | null = null;

/**
 * Detecta disponibilidade real de localStorage (navegação privada pode lançar).
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__pte_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readRaw(available: boolean): string | null {
  if (available) {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
  return memoryStore;
}

function writeRaw(available: boolean, value: string): void {
  if (available) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return;
    } catch {
      // Falha de escrita (ex.: cota) — cai para memória.
    }
  }
  memoryStore = value;
}

export function load(): LoadResult {
  const available = isLocalStorageAvailable();
  const raw = readRaw(available);

  if (raw == null) {
    return { state: defaultState(), usingFallback: !available, recovered: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // JSON corrompido → reset seguro.
    const fresh = defaultState();
    writeRaw(available, JSON.stringify(fresh));
    return { state: fresh, usingFallback: !available, recovered: true };
  }

  if (!isValidState(parsed)) {
    const fresh = defaultState();
    writeRaw(available, JSON.stringify(fresh));
    return { state: fresh, usingFallback: !available, recovered: true };
  }

  const migrated = migrate(parsed);
  return { state: migrated, usingFallback: !available, recovered: false };
}

export function save(state: ProgressState): void {
  const available = isLocalStorageAvailable();
  writeRaw(available, JSON.stringify(state));
}

/** Zera o progresso (grava defaults). */
export function resetStorage(): ProgressState {
  const fresh = defaultState();
  save(fresh);
  return fresh;
}

/** Para testes: limpa o fallback em memória. */
export function __clearMemoryStore(): void {
  memoryStore = null;
}
