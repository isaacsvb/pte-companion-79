import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ProgressState, GamificationState } from '../storage/schema';
import { load, save, resetStorage } from '../storage/storage';
import { importFromJson } from '../storage/exportImport';
import type { SrsCardState } from '../domain/srs';
import {
  awardXp,
  updateStreak,
  evaluateAchievements,
  levelFromXp,
  type AchievementContext,
  XP_SRS_REVIEW,
  XP_TASK_SESSION,
  XP_PLAN_ACTIVITY,
  XP_STRATEGY_CHAPTER,
} from '../domain/gamification';
import { VOCAB_MODULES } from '../content/vocabulary';
import { countCompletedVocabModules, countMasteredCards } from '../routes/Dashboard/dashboardSummary';

export interface ProgressContextValue {
  state: ProgressState;
  usingFallback: boolean;
  recovered: boolean;
  // SRS
  upsertCard: (card: SrsCardState) => void;
  // Estratégias
  toggleChapterRead: (chapterId: string, read: boolean) => void;
  // Templates
  saveTemplateFill: (templateId: string, values: Record<string, string>) => void;
  // Treino
  registerTaskSession: (taskId: string) => void;
  // Planos
  startPlan: (planId: string) => void;
  toggleActivity: (planId: string, activityId: string, done: boolean) => void;
  // Progresso geral
  replaceState: (next: ProgressState) => void;
  importJson: (json: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Deriva o contexto de conquistas a partir do estado já atualizado.
 * Pura: não lê relógio nem produz efeitos colaterais.
 */
function deriveAchievementContext(state: ProgressState): AchievementContext {
  const g = state.gamification;
  return {
    cardsReviewedTotal: g.cardsReviewedTotal,
    currentStreak: g.currentStreak,
    longestStreak: g.longestStreak,
    tasksPracticed: state.taskSessions.length,
    chaptersRead: Object.values(state.strategyRead).filter(Boolean).length,
    masteredCards: countMasteredCards(state.srs),
    completedVocabModules: countCompletedVocabModules(state.srs, VOCAB_MODULES),
    xp: g.xp,
    level: levelFromXp(g.xp).level,
  };
}

/**
 * Aplica um evento de gamificação de forma imutável: soma XP, atualiza a
 * ofensiva (streak) com o relógio injetado e desbloqueia conquistas novas.
 * Recebe o estado JÁ com as demais mutações aplicadas (ex.: taskSessions atualizado).
 */
function applyGamification(
  state: ProgressState,
  xpAmount: number,
  now: Date,
  extra: Partial<GamificationState> = {},
): ProgressState {
  const prev = state.gamification;
  const streak = updateStreak(
    {
      lastActiveDay: prev.lastActiveDay,
      currentStreak: prev.currentStreak,
      longestStreak: prev.longestStreak,
    },
    now,
  );

  const nextGamification: GamificationState = {
    ...prev,
    ...extra,
    xp: awardXp(prev.xp, xpAmount),
    lastActiveDay: streak.lastActiveDay,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
  };

  const withGamification: ProgressState = { ...state, gamification: nextGamification };

  const ctx = deriveAchievementContext(withGamification);
  const { newlyUnlocked } = evaluateAchievements(ctx, nextGamification.unlockedAchievements, now);

  if (newlyUnlocked.length === 0) return withGamification;

  const iso = now.toISOString();
  const unlockedAchievements = { ...nextGamification.unlockedAchievements };
  for (const id of newlyUnlocked) unlockedAchievements[id] = iso;

  return {
    ...withGamification,
    gamification: { ...nextGamification, unlockedAchievements },
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const initial = useRef(load());
  const [state, setState] = useState<ProgressState>(initial.current.state);
  const [usingFallback] = useState<boolean>(initial.current.usingFallback);
  const [recovered] = useState<boolean>(initial.current.recovered);

  // Persiste a cada mutação.
  useEffect(() => {
    save(state);
  }, [state]);

  const upsertCard = useCallback((card: SrsCardState) => {
    setState((prev) => {
      const withCard: ProgressState = {
        ...prev,
        srs: { ...prev.srs, [card.entryId]: card },
      };
      const bumped: ProgressState = {
        ...withCard,
        gamification: {
          ...withCard.gamification,
          cardsReviewedTotal: withCard.gamification.cardsReviewedTotal + 1,
        },
      };
      return applyGamification(bumped, XP_SRS_REVIEW, new Date());
    });
  }, []);

  const toggleChapterRead = useCallback((chapterId: string, read: boolean) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        strategyRead: { ...prev.strategyRead, [chapterId]: read },
      };
      // Só premia ao marcar como lido (não subtrai ao desmarcar).
      return read ? applyGamification(next, XP_STRATEGY_CHAPTER, new Date()) : next;
    });
  }, []);

  const saveTemplateFill = useCallback(
    (templateId: string, values: Record<string, string>) => {
      setState((prev) => ({
        ...prev,
        templateFills: { ...prev.templateFills, [templateId]: values },
      }));
    },
    [],
  );

  const registerTaskSession = useCallback((taskId: string) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        taskSessions: [...prev.taskSessions, { taskId, completedAt: new Date().toISOString() }],
      };
      return applyGamification(next, XP_TASK_SESSION, new Date());
    });
  }, []);

  const startPlan = useCallback((planId: string) => {
    setState((prev) => {
      const existing = prev.plans[planId];
      return {
        ...prev,
        plans: {
          ...prev.plans,
          [planId]: {
            startedAt: existing?.startedAt ?? new Date().toISOString(),
            doneActivities: existing?.doneActivities ?? {},
          },
        },
      };
    });
  }, []);

  const toggleActivity = useCallback(
    (planId: string, activityId: string, done: boolean) => {
      setState((prev) => {
        const existing = prev.plans[planId] ?? { startedAt: null, doneActivities: {} };
        const next: ProgressState = {
          ...prev,
          plans: {
            ...prev.plans,
            [planId]: {
              ...existing,
              doneActivities: { ...existing.doneActivities, [activityId]: done },
            },
          },
        };
        // Só premia ao concluir (não subtrai XP ao desmarcar).
        return done ? applyGamification(next, XP_PLAN_ACTIVITY, new Date()) : next;
      });
    },
    [],
  );

  const replaceState = useCallback((next: ProgressState) => setState(next), []);

  const importJson = useCallback((json: string) => {
    const next = importFromJson(json);
    setState(next);
  }, []);

  const reset = useCallback(() => {
    setState(resetStorage());
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      usingFallback,
      recovered,
      upsertCard,
      toggleChapterRead,
      saveTemplateFill,
      registerTaskSession,
      startPlan,
      toggleActivity,
      replaceState,
      importJson,
      reset,
    }),
    [
      state,
      usingFallback,
      recovered,
      upsertCard,
      toggleChapterRead,
      saveTemplateFill,
      registerTaskSession,
      startPlan,
      toggleActivity,
      replaceState,
      importJson,
      reset,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  return ctx;
}
