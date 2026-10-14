// Tipos dos dados de conteúdo derivados dos PDFs do usuário.
// Dados ficam separados da UI (Req 8.2).

export type SkillPart = 'speaking' | 'writing' | 'reading' | 'listening';
export type TaskTier = 'gold' | 'junk' | 'neutral';

export interface PteTask {
  id: string;
  /** Nome oficial em inglês. */
  name: string;
  part: SkillPart;
  /** Tempo de preparação em segundos; null quando não há preparação. */
  prepSeconds: number | null;
  /** Tempo de resposta em segundos (valor usado pelo timer de resposta). */
  responseSeconds: number;
  /** Observação literal da Tabela Mestra para prep/resposta (ex.: "35-40s"). */
  timing: string;
  /** Regra de palavras/caracteres quando aplicável. */
  wordRule?: string;
  wordLimit?: { min?: number; max?: number };
  requiresMic: boolean;
  tier: TaskTier;
  /** Instrução/descrição em PT-BR. */
  description: string;
  /** true quando a resposta é por texto (habilita WordCounter). */
  isWriting: boolean;
  /** Marca itens cujo dado ainda não foi confirmado do PDF. */
  pending?: boolean;
}

export interface VocabEntry {
  id: string;
  english: string;
  practicalPronunciation: string;
  translationPtBr: string;
  pending?: boolean;
}

export interface VocabModule {
  id: string;
  index: number;
  title: string;
  entries: VocabEntry[];
  /** true quando o módulo ainda não teve as entradas transcritas do PDF. */
  pending?: boolean;
}

export interface TemplatePlaceholder {
  key: string;
  label: string;
  hint?: string;
}

export interface TemplateDef {
  id: string;
  taskName: string;
  description: string;
  body: string;
  placeholders: TemplatePlaceholder[];
  wordLimit?: { min?: number; max?: number };
  pending?: boolean;
}

export interface StrategyChapter {
  id: string;
  title: string;
  order: number;
  bodyMarkdown: string;
  pending?: boolean;
}

export interface PlanActivity {
  id: string;
  label: string;
  /** rota interna para atalho (ex.: '/vocabulario'). */
  link?: string;
}

export interface PlanDay {
  day: number;
  title?: string;
  activities: PlanActivity[];
}

export interface StudyPlan {
  id: '90-day' | 'anki-25';
  title: string;
  description: string;
  days: PlanDay[];
}
