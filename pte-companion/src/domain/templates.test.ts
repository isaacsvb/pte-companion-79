import { describe, it, expect } from 'vitest';
import {
  assembleTemplate,
  countWords,
  checkWordLimit,
  extractPlaceholderKeys,
} from './templates';

describe('templates — montagem e contagem', () => {
  it('substitui placeholders preenchidos e mantém os vazios', () => {
    const body = 'This is [TÓPICO] with [DETALHE].';
    const out = assembleTemplate(body, { 'TÓPICO': 'education' });
    expect(out).toBe('This is education with [DETALHE].');
  });

  it('conta palavras ignorando placeholders não preenchidos', () => {
    expect(countWords('one two three')).toBe(3);
    expect(countWords('one [GAP] three')).toBe(2);
    expect(countWords('   ')).toBe(0);
  });

  it('sinaliza dentro/fora da faixa', () => {
    const within = checkWordLimit('a b c d e', { min: 3, max: 10 });
    expect(within.withinRange).toBe(true);
    expect(within.count).toBe(5);

    const below = checkWordLimit('a b', { min: 3, max: 10 });
    expect(below.withinRange).toBe(false);

    const above = checkWordLimit('a b c d', { min: 1, max: 3 });
    expect(above.withinRange).toBe(false);
  });

  it('sem limite sempre está dentro da faixa', () => {
    expect(checkWordLimit('qualquer coisa').withinRange).toBe(true);
  });

  it('extrai as chaves de placeholder', () => {
    const keys = extractPlaceholderKeys('[A] e [B] e [A]');
    expect(keys.sort()).toEqual(['A', 'B']);
  });
});
