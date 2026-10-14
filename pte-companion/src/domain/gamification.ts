// Motor de gamificação — lógica pura e determinística (estilo srs.ts/timers.ts).
// Nenhuma função de cálculo usa Date.now()/new Date() internamente: o relógio e
// os valores são injetados pelos chamadores. Toda a cópia é em Português (Brasil).

// ---------------------------------------------------------------------------
// XP e níveis
// ---------------------------------------------------------------------------

/** XP concedido por cada cartão revisado no SRS. */
export const XP_SRS_REVIEW = 5;
/** XP concedido ao concluir uma sessão de treino de tarefa. */
export const XP_TASK_SESSION = 20;
/** XP concedido ao marcar uma atividade do plano como concluída. */
export const XP_PLAN_ACTIVITY = 10;
/** XP concedido ao marcar um capítulo de estratégia como lido. */
export const XP_STRATEGY_CHAPTER = 15;

/**
 * Curva de níveis: cada nível N (>=1) exige `100 * N` de XP para ser concluído.
 * Ou seja, do nível 1 para o 2 precisa de 100 XP; do 2 para o 3, mais 200 XP; etc.
 * O XP total acumulado para alcançar o início do nível N é a soma 100*(1+2+...+(N-1)).
 */
export const XP_LEVEL_BASE = 100;

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

/** XP total necessário para completar um dado nível (>=1). */
function xpForLevel(level: number): number {
  return XP_LEVEL_BASE * level;
}

/**
 * Deriva o nível a partir do XP total acumulado.
 * Determinístico, monotônico e sem efeitos colaterais.
 */
export function levelFromXp(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  let level = 1;
  let remaining = safeXp;
  // Consome o XP necessário para cada nível até não restar o suficiente.
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  const xpForNextLevel = xpForLevel(level);
  const progressPercent = Math.min(
    100,
    Math.round((remaining / xpForNextLevel) * 100),
  );
  return {
    level,
    xpIntoLevel: remaining,
    xpForNextLevel,
    progressPercent,
  };
}

/** Soma XP de forma segura: base e quantidade são tratadas como não-negativas. */
export function awardXp(current: number, amount: number): number {
  const base = Math.max(0, Math.floor(current));
  const add = Math.max(0, Math.floor(amount));
  return base + add;
}

// ---------------------------------------------------------------------------
// Ofensiva (streak) diária
// ---------------------------------------------------------------------------

/** Converte uma data para a chave de dia local yyyy-mm-dd. */
export function toDayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface StreakState {
  lastActiveDay: string | null;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Atualiza a ofensiva diária com base no último dia ativo.
 * Regras:
 *  - mesmo dia  -> sem mudança (apenas garante longestStreak coerente);
 *  - dia anterior (consecutivo) -> currentStreak + 1;
 *  - lacuna ou null -> currentStreak reinicia em 1.
 * Sempre define lastActiveDay = hoje e longestStreak = max(longestStreak, currentStreak).
 * Relógio injetável para determinismo.
 */
export function updateStreak(prev: StreakState, now: Date = new Date()): StreakState {
  const today = toDayKey(now);

  if (prev.lastActiveDay === today) {
    // Já estudou hoje: nada muda além de manter o maior registro coerente.
    return {
      lastActiveDay: today,
      currentStreak: prev.currentStreak,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak),
    };
  }

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayKey = toDayKey(yesterday);

  let currentStreak: number;
  if (prev.lastActiveDay === yesterdayKey) {
    currentStreak = prev.currentStreak + 1;
  } else {
    // Lacuna ou primeiro dia (null).
    currentStreak = 1;
  }

  return {
    lastActiveDay: today,
    currentStreak,
    longestStreak: Math.max(prev.longestStreak, currentStreak),
  };
}

// ---------------------------------------------------------------------------
// Conquistas (achievements) declarativas
// ---------------------------------------------------------------------------

/** Snapshot derivado usado pelos predicados das conquistas. */
export interface AchievementContext {
  cardsReviewedTotal: number;
  currentStreak: number;
  longestStreak: number;
  tasksPracticed: number;
  chaptersRead: number;
  masteredCards: number;
  completedVocabModules: number;
  xp: number;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  predicate: (ctx: AchievementContext) => boolean;
}

/** Catálogo declarativo de conquistas (dados em Português do Brasil). */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-task',
    title: 'Primeiro treino concluído',
    description: 'Conclua sua primeira sessão de treino de tarefa.',
    icon: '🎯',
    predicate: (ctx) => ctx.tasksPracticed >= 1,
  },
  {
    id: 'first-chapter',
    title: 'Primeiro capítulo lido',
    description: 'Leia seu primeiro capítulo do guia de estratégias.',
    icon: '📖',
    predicate: (ctx) => ctx.chaptersRead >= 1,
  },
  {
    id: 'cards-100',
    title: '100 cartões revisados',
    description: 'Revise 100 cartões de vocabulário no total.',
    icon: '🃏',
    predicate: (ctx) => ctx.cardsReviewedTotal >= 100,
  },
  {
    id: 'cards-500',
    title: '500 cartões revisados',
    description: 'Revise 500 cartões de vocabulário no total.',
    icon: '🏅',
    predicate: (ctx) => ctx.cardsReviewedTotal >= 500,
  },
  {
    id: 'streak-7',
    title: '7 dias de ofensiva',
    description: 'Estude por 7 dias consecutivos.',
    icon: '🔥',
    predicate: (ctx) => ctx.longestStreak >= 7,
  },
  {
    id: 'streak-30',
    title: '30 dias de ofensiva',
    description: 'Estude por 30 dias consecutivos.',
    icon: '⚡',
    predicate: (ctx) => ctx.longestStreak >= 30,
  },
  {
    id: 'vocab-module-mastered',
    title: 'Módulo de vocabulário dominado',
    description: 'Domine todos os cartões de pelo menos um módulo de vocabulário.',
    icon: '📚',
    predicate: (ctx) => ctx.completedVocabModules >= 1,
  },
  {
    id: 'level-5',
    title: 'Nível 5 alcançado',
    description: 'Chegue ao nível 5 acumulando XP.',
    icon: '⭐',
    predicate: (ctx) => ctx.level >= 5,
  },
];

export interface EvaluateResult {
  newlyUnlocked: string[];
}

/**
 * Avalia as conquistas contra o contexto derivado e retorna os ids cujo
 * predicado é verdadeiro e que ainda NÃO foram desbloqueados.
 * Puro: `now` é injetado apenas para manter a assinatura determinística/consistente
 * com o restante do módulo (o chamador registra o timestamp de desbloqueio).
 */
export function evaluateAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: Record<string, string>,
  _now: Date = new Date(),
): EvaluateResult {
  const newlyUnlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (alreadyUnlocked[a.id]) continue;
    if (a.predicate(ctx)) newlyUnlocked.push(a.id);
  }
  return { newlyUnlocked };
}
