// Montagem de templates (substituição de placeholders) + contagem de palavras.

import type { TemplateDef } from '../content/types';

const PLACEHOLDER_RE = /\[([A-ZÀ-Ú0-9_]+)\]/g;

/**
 * Monta o texto final substituindo [CHAVE] pelos valores preenchidos.
 * Placeholders não preenchidos permanecem demarcados (ex.: [TÓPICO]).
 */
export function assembleTemplate(body: string, values: Record<string, string>): string {
  return body.replace(PLACEHOLDER_RE, (match, key: string) => {
    const value = values[key];
    return value && value.trim().length > 0 ? value : match;
  });
}

/** Conta palavras ignorando placeholders ainda não preenchidos. */
export function countWords(text: string): number {
  const withoutPlaceholders = text.replace(PLACEHOLDER_RE, ' ');
  const trimmed = withoutPlaceholders.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

export interface WordLimitStatus {
  count: number;
  withinRange: boolean;
  min?: number;
  max?: number;
}

export function checkWordLimit(
  text: string,
  limit?: { min?: number; max?: number },
): WordLimitStatus {
  const count = countWords(text);
  if (!limit) return { count, withinRange: true };
  const aboveMin = limit.min == null || count >= limit.min;
  const belowMax = limit.max == null || count <= limit.max;
  return { count, withinRange: aboveMin && belowMax, min: limit.min, max: limit.max };
}

/** Lista as chaves de placeholder presentes no corpo do template. */
export function extractPlaceholderKeys(body: string): string[] {
  const keys = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(PLACEHOLDER_RE);
  while ((m = re.exec(body)) !== null) keys.add(m[1]);
  return [...keys];
}

export function assembleFromTemplate(
  template: TemplateDef,
  values: Record<string, string>,
): { text: string; limit: WordLimitStatus } {
  const text = assembleTemplate(template.body, values);
  return { text, limit: checkWordLimit(text, template.wordLimit) };
}
