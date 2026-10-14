import { describe, it, expect } from 'vitest';
import { TASKS } from './tasks';
import { VOCAB_MODULES } from './vocabulary';
import { TEMPLATES } from './templates';
import { STRATEGY_CHAPTERS } from './strategy';
import { STUDY_PLANS } from './plans';

describe('conteúdo — integridade dos dados', () => {
  it('contém exatamente as 22 tarefas oficiais', () => {
    expect(TASKS).toHaveLength(22);
  });

  it('toda tarefa tem id único, tempo de resposta e tier válido', () => {
    const ids = new Set<string>();
    for (const t of TASKS) {
      expect(t.id).toBeTruthy();
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
      expect(t.responseSeconds).toBeGreaterThan(0);
      expect(['gold', 'junk', 'neutral']).toContain(t.tier);
      expect(['speaking', 'writing', 'reading', 'listening']).toContain(t.part);
    }
  });

  it('tarefas OURO incluem WFD, Read Aloud, Repeat Sentence e R&W FIB', () => {
    const gold = TASKS.filter((t) => t.tier === 'gold').map((t) => t.id);
    expect(gold).toContain('write-from-dictation');
    expect(gold).toContain('read-aloud');
    expect(gold).toContain('repeat-sentence');
    expect(gold).toContain('rw-fill-in-the-blanks');
  });

  it('as tarefas de fala exigem microfone', () => {
    const speaking = TASKS.filter((t) => t.part === 'speaking');
    expect(speaking.length).toBeGreaterThan(0);
    for (const t of speaking) expect(t.requiresMic).toBe(true);
  });

  it('limites de palavras seguem o Apêndice E', () => {
    const essay = TASKS.find((t) => t.id === 'write-essay');
    expect(essay?.wordLimit).toEqual({ min: 250, max: 280 });
    const swt = TASKS.find((t) => t.id === 'summarize-written-text');
    expect(swt?.wordLimit).toEqual({ min: 35, max: 50 });
    const sst = TASKS.find((t) => t.id === 'summarize-spoken-text');
    expect(sst?.wordLimit).toEqual({ min: 50, max: 70 });
  });

  it('possui 50 módulos de vocabulário 100% completos e bem formados', () => {
    expect(VOCAB_MODULES).toHaveLength(50);

    const ids = new Set<string>();
    let totalEntries = 0;

    for (const m of VOCAB_MODULES) {
      expect(m.title).toBeTruthy();
      // Nenhum módulo pode permanecer pendente: o vocabulário está 100% completo.
      expect(m.pending).toBeFalsy();
      // Cada módulo tem ~10 entradas (mínimo 8).
      expect(m.entries.length).toBeGreaterThanOrEqual(8);

      for (const e of m.entries) {
        expect(e.english).toBeTruthy();
        expect(e.practicalPronunciation).toBeTruthy();
        expect(e.translationPtBr).toBeTruthy();
        // Nenhuma entrada pode estar marcada como pendente.
        expect(e.pending).toBeFalsy();
        // Ids globalmente únicos no padrão mNN-eKK.
        expect(e.id).toMatch(/^m\d{2}-e\d{2}$/);
        expect(ids.has(e.id)).toBe(false);
        ids.add(e.id);
        totalEntries += 1;
      }
    }

    // 50 módulos × ~10 entradas ⇒ pelo menos 450 chunks transcritos.
    expect(totalEntries).toBeGreaterThanOrEqual(450);
  });

  it('cobre os templates universais exigidos', () => {
    const names = TEMPLATES.map((t) => t.id);
    [
      'describe-image',
      'write-essay',
      'summarize-written-text',
      'summarize-spoken-text',
      're-tell-lecture',
      'respond-to-a-situation',
      'summarize-group-discussion',
    ].forEach((id) => expect(names).toContain(id));
  });

  it('capítulos de estratégia cobrem os temas obrigatórios', () => {
    const ids = STRATEGY_CHAPTERS.map((c) => c.id);
    ['algorithm-logic', 'chunking', 'pareto-8020', 'phonetics-brazilians', 'us-uk-spelling', 'grammar-blacklist', 'faqs'].forEach(
      (id) => expect(ids).toContain(id),
    );
  });

  it('planos de 90 e 25 dias existem com dias corretos', () => {
    const ninety = STUDY_PLANS.find((p) => p.id === '90-day');
    const anki = STUDY_PLANS.find((p) => p.id === 'anki-25');
    expect(ninety?.days).toHaveLength(90);
    expect(anki?.days).toHaveLength(25);
  });

  it('nenhum conteúdo referencia marcas de terceiros pagos', () => {
    const blob = JSON.stringify({ TASKS, VOCAB_MODULES, TEMPLATES, STRATEGY_CHAPTERS, STUDY_PLANS }).toLowerCase();
    expect(blob).not.toContain('alfapte');
  });
});
