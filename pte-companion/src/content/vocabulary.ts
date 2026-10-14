import type { VocabModule, VocabEntry } from './types';

// Vocabulário / 500 Chunks — derivado do PDF "Inglês Real – 500 Expressões / Foco PTE Academic".
// 50 módulos, cada um com ~10 entradas (inglês + Pronúncia Prática + Tradução PT-BR).
//
// Títulos dos módulos (01–50) transcritos do sumário do PDF.
// Entradas legíveis são transcritas; módulos/entradas ainda não transcritos
// do PDF ficam marcados como "pendente de conteúdo" (Req 8.4) — nunca inventados.

const MODULE_TITLES: string[] = [
  'Métodos de Pesquisa e Evidências Científicas',
  'Educação e Aprendizagem',
  'Tecnologia e Inovação',
  'Meio Ambiente e Sustentabilidade',
  'Economia e Trabalho',
  'Saúde e Bem-estar',
  'Governo e Políticas Públicas',
  'Cultura e Sociedade',
  'Globalização e Relações Internacionais',
  'Mídia e Comunicação',
  'Arte e Criatividade',
  'História e Civilização',
  'Psicologia e Comportamento',
  'Negócios e Empreendedorismo',
  'Direito e Justiça',
  'Urbanização e Transporte',
  'Energia e Recursos Naturais',
  'Agricultura e Alimentação',
  'Ciência e Descobertas',
  'Ética e Moralidade',
  'Família e Relações Pessoais',
  'Linguagem e Comunicação Humana',
  'Esporte e Atividade Física',
  'Turismo e Viagens',
  'Religião e Espiritualidade',
  'Demografia e População',
  'Pobreza e Desigualdade',
  'Inovação Científica e Pesquisa Aplicada',
  'Comportamento do Consumidor',
  'Mudanças Climáticas',
  'Inteligência Artificial e Automação',
  'Educação a Distância e Online',
  'Trabalho Remoto e Flexibilidade',
  'Marketing e Publicidade',
  'Finanças Pessoais e Investimentos',
  'Biodiversidade e Conservação',
  'Nutrição e Dieta',
  'Doenças e Epidemias',
  'Infraestrutura e Desenvolvimento',
  'Migração e Refugiados',
  'Gênero e Igualdade',
  'Juventude e Gerações',
  'Envelhecimento e Terceira Idade',
  'Crime e Segurança',
  'Inovação em Transporte e Mobilidade',
  'Espaço e Exploração Cósmica',
  'Oceanos e Recursos Marinhos',
  'Florestas e Desmatamento',
  'Água e Saneamento',
  'Write From Dictation & Repeat Sentence Chunks',
];

// Entradas transcritas (amostra legível do PDF). As demais entradas de cada módulo
// e os módulos sem transcrição legível permanecem como "pendente de conteúdo".
const SEEDED_ENTRIES: Record<number, VocabEntry[]> = {
  1: [
    {
      id: 'm01-e01',
      english: 'a growing body of research',
      practicalPronunciation: 'ê grôu-in bódi óv ri-sârtch',
      translationPtBr: 'um crescente conjunto de pesquisas',
    },
    {
      id: 'm01-e02',
      english: 'empirical evidence suggests that',
      practicalPronunciation: 'em-pí-ri-cou é-vi-dens sâg-djésts dat',
      translationPtBr: 'evidências empíricas sugerem que',
    },
    {
      id: 'm01-e03',
      english: 'conduct a comprehensive study',
      practicalPronunciation: 'côn-dâct ê côm-pri-rén-siv stâdi',
      translationPtBr: 'conduzir um estudo abrangente',
    },
    {
      id: 'm01-e04',
      english: 'the findings indicate that',
      practicalPronunciation: 'dâ fáin-dings ín-di-queit dat',
      translationPtBr: 'os resultados indicam que',
    },
    {
      id: 'm01-e05',
      english: 'a significant correlation between',
      practicalPronunciation: 'ê sig-ní-fi-cant có-re-lei-shon bi-tuín',
      translationPtBr: 'uma correlação significativa entre',
    },
  ],
  50: [
    {
      id: 'm50-e01',
      english: 'The committee approved the proposal unanimously.',
      practicalPronunciation: 'dâ cô-mí-ti ê-prúvd dâ prô-pôu-zal iu-ná-ni-mas-li',
      translationPtBr: 'O comitê aprovou a proposta por unanimidade.',
    },
    {
      id: 'm50-e02',
      english: 'Researchers published their findings last week.',
      practicalPronunciation: 'ri-sâr-tchers pâ-blisht dér fáin-dings lést uík',
      translationPtBr: 'Os pesquisadores publicaram seus resultados na semana passada.',
    },
    {
      id: 'm50-e03',
      english: 'The lecture will begin promptly at nine.',
      practicalPronunciation: 'dâ léc-tchâr uil bi-guín prómpt-li at náin',
      translationPtBr: 'A palestra começará pontualmente às nove.',
    },
  ],
};

export const VOCAB_MODULES: VocabModule[] = MODULE_TITLES.map((title, i) => {
  const index = i + 1;
  const id = `module-${String(index).padStart(2, '0')}`;
  const seeded = SEEDED_ENTRIES[index];
  if (seeded && seeded.length > 0) {
    return { id, index, title, entries: seeded };
  }
  // Módulo ainda não transcrito do PDF: marcado como pendente, sem inventar entradas.
  return { id, index, title, entries: [], pending: true };
});

export const ALL_VOCAB_ENTRIES: VocabEntry[] = VOCAB_MODULES.flatMap((m) => m.entries);

export function getModuleOfEntry(entryId: string): VocabModule | undefined {
  return VOCAB_MODULES.find((m) => m.entries.some((e) => e.id === entryId));
}
