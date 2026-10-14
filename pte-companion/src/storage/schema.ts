// Schema do estado de progresso + versão + migração idempotente + defaults.

import type { SrsCardState } from '../domain/srs';

export const SCHEMA_VERSION = 2;
export const STORAGE_KEY = 'pte-companion';

/** Estado de gamificação: XP, níveis, ofensiva (streak) e conquistas. */
export interface GamificationState {
  xp: number;
  /** Último dia de estudo no formato yyyy-mm-dd (local). null se nunca estudou. */
  lastActiveDay: string | null;
  currentStreak: number;
  longestStreak: number;
  /** achievementId -> timestamp ISO de desbloqueio. */
  unlockedAchievements: Record<string, string>;
  /** Total acumulado de cartões revisados (não decresce). */
  cardsReviewedTotal: number;
}

export interface ProgressState {
  schemaVersion: number;
  srs: Record<string, SrsCardState>;
  strategyRead: Record<string, boolean>;
  templateFills: Record<string, Record<string, string>>;
  taskSessions: { taskId: string; completedAt: string }[];
  plans: Record<string, { startedAt: string | null; doneActivities: Record<string, boolean> }>;
  gamification: GamificationState;
}

export function defaultGamification(): GamificationState {
  return {
    xp: 0,
    lastActiveDay: null,
    currentStreak: 0,
    longestStreak: 0,
    unlockedAchievements: {},
    cardsReviewedTotal: 0,
  };
}

export function defaultState(): ProgressState {
  return {
    schemaVersion: SCHEMA_VERSION,
    srs: {},
    strategyRead: {},
    templateFills: {},
    taskSessions: [],
    plans: {},
    gamification: defaultGamification(),
  };
}

/**
 * Valida a forma básica do objeto carregado. Retorna false para dados corrompidos.
 *
 * Importante: estados válidos de versões antigas (v1) que ainda NÃO possuem o
 * campo `gamification` devem continuar sendo aceitos (compatibilidade). A
 * migração preenche os campos ausentes com defaults.
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
  // `gamification` é opcional aqui: estados v1 válidos não o possuem. Se existir,
  // precisa ser um objeto (defensivo contra lixo). migrate() normaliza o resto.
  if ('gamification' in v && (typeof v.gamification !== 'object' || v.gamification === null)) {
    return false;
  }
  return true;
}

/**
 * Migração idempotente: leva qualquer versão anterior até SCHEMA_VERSION,
 * preservando campos conhecidos e preenchendo os ausentes com defaults.
 */
export function migrate(raw: ProgressState): ProgressState {
  const base = defaultState();
  const rawGamification = (raw.gamification ?? {}) as Partial<GamificationState>;
  const migrated: ProgressState = {
    ...base,
    ...raw,
    srs: { ...base.srs, ...raw.srs },
    strategyRead: { ...base.strategyRead, ...raw.strategyRead },
    templateFills: { ...base.templateFills, ...raw.templateFills },
    taskSessions: Array.isArray(raw.taskSessions) ? raw.taskSessions : base.taskSessions,
    plans: { ...base.plans, ...raw.plans },
    gamification: {
      ...base.gamification,
      ...rawGamification,
      unlockedAchievements: {
        ...base.gamification.unlockedAchievements,
        ...(rawGamification.unlockedAchievements ?? {}),
      },
    },
  };
  // Futuras migrações entre versões iriam aqui, condicionadas a raw.schemaVersion.
  migrated.schemaVersion = SCHEMA_VERSION;
  return migrated;
}
