// Schema do estado de progresso + versão + migração idempotente + defaults.

import type { SrsCardState } from '../domain/srs';

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'pte-companion';

export interface ProgressState {
  schemaVersion: number;
  srs: Record<string, SrsCardState>;
  strategyRead: Record<string, boolean>;
  templateFills: Record<string, Record<string, string>>;
  taskSessions: { taskId: string; completedAt: string }[];
  plans: Record<string, { startedAt: string | null; doneActivities: Record<string, boolean> }>;
}

export function defaultState(): ProgressState {
  return {
    schemaVersion: SCHEMA_VERSION,
    srs: {},
    strategyRead: {},
    templateFills: {},
    taskSessions: [],
    plans: {},
  };
}

/**
 * Valida a forma básica do objeto carregado. Retorna false para dados corrompidos.
 */
export function isValidState(value: unknown): value is ProgressState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.schemaVersion !== 'number') return false;
  if (typeof v.srs !== 'object' || v.srs === null) return false;
  if (typeof v.strategyRead !== 'object' || v.strategyRead === null) return false;
  if (typeof v.templateFills !== 'object' || v.templateFills === null) return false;
  if (!Array.isArray(v.taskSessions)) return false;
  if (typeof v.plans !== 'object' || v.plans === null) return false;
  return true;
}

/**
 * Migração idempotente: leva qualquer versão anterior até SCHEMA_VERSION,
 * preservando campos conhecidos e preenchendo os ausentes com defaults.
 */
export function migrate(raw: ProgressState): ProgressState {
  const base = defaultState();
  const migrated: ProgressState = {
    ...base,
    ...raw,
    srs: { ...base.srs, ...raw.srs },
    strategyRead: { ...base.strategyRead, ...raw.strategyRead },
    templateFills: { ...base.templateFills, ...raw.templateFills },
    taskSessions: Array.isArray(raw.taskSessions) ? raw.taskSessions : base.taskSessions,
    plans: { ...base.plans, ...raw.plans },
  };
  // Futuras migrações entre versões iriam aqui, condicionadas a raw.schemaVersion.
  migrated.schemaVersion = SCHEMA_VERSION;
  return migrated;
}
