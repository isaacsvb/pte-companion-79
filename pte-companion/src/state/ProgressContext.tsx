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
import { ProgressState } from '../storage/schema';
import { load, save, resetStorage } from '../storage/storage';
import { importFromJson } from '../storage/exportImport';
import type { SrsCardState } from '../domain/srs';

interface ProgressContextValue {
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
    setState((prev) => ({ ...prev, srs: { ...prev.srs, [card.entryId]: card } }));
  }, []);

  const toggleChapterRead = useCallback((chapterId: string, read: boolean) => {
    setState((prev) => ({
      ...prev,
      strategyRead: { ...prev.strategyRead, [chapterId]: read },
    }));
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
    setState((prev) => ({
      ...prev,
      taskSessions: [...prev.taskSessions, { taskId, completedAt: new Date().toISOString() }],
    }));
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
        return {
          ...prev,
          plans: {
            ...prev.plans,
            [planId]: {
              ...existing,
              doneActivities: { ...existing.doneActivities, [activityId]: done },
            },
          },
        };
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
