import type { VocabModule, VocabEntry } from './types';

// Vocabulário / 500 Chunks — derivado do PDF "Inglês Real – 500 Expressões / Foco PTE Academic".
// 50 módulos, cada um com ~10 entradas (inglês + Pronúncia Prática + Tradução PT-BR).
//
// Títulos dos módulos (01–50) transcritos do sumário do PDF.
// Entradas legíveis são transcritas; módulos/entradas ainda não transcritos
// do PDF ficam marcados como "pendente de conteúdo" (Req 8.4) — nunca inventados.

// Títulos autoritativos (01–50) conforme o sumário do material-fonte
// "Inglês Real – 500 Expressões / Foco PTE Academic".
const MODULE_TITLES: string[] = [
  'Métodos de Pesquisa e Evidências Científicas',
  'Mudanças Climáticas e Aquecimento Global',
  'Energia Renovável e Sustentabilidade',
  'Biodiversidade, Fauna e Ecossistemas',
  'Recursos Hídricos e Preservação',
  'Poluição, Resíduos e Reciclagem',
  'Agricultura e Segurança Alimentar',
  'Inteligência Artificial e Automação',
  'Análise de Dados e Interpretação Estatística',
  'Transformação Digital e Redes',
  'Cibersegurança e Privacidade de Dados',
  'Inovação Tecnológica e Engenharia',
  'Mídias Sociais e Comunicação Digital',
  'Exploração Espacial e Astronomia',
  'Saúde Pública e Prevenção',
  'Pesquisa Médica e Ensaios Clínicos',
  'Nutrição, Metabolismo e Dieta',
  'Atividade Física, Esporte e Fisiologia',
  'Psicologia Cognitiva e Memória',
  'Saúde Mental e Gestão de Estresse',
  'Comportamento Humano e Dinâmica Social',
  'Planejamento Urbano e Cidades Sustentáveis',
  'Transporte Público e Mobilidade Urbana',
  'Demografia, População e Migração',
  'História, Arqueologia e Patrimônio',
  'Cultura, Artes e Sociedade',
  'Economia Global e Comércio',
  'Mercados Financeiros e Investimentos',
  'Gestão Corporativa e Estratégia',
  'Mercado de Trabalho e Produtividade',
  'Comportamento do Consumidor e Marketing',
  'Políticas Públicas e Governança',
  'Campus Universitário e Instalações',
  'Aulas, Palestras e Seminários',
  'Trabalhos Acadêmicos e Prazos',
  'Avaliações, Exames e Desempenho',
  'Bolsas de Estudo e Pós-Graduação',
  'Describe Image: Altas e Picos',
  'Describe Image: Quedas e Declínios',
  'Describe Image: Estabilidade e Flutuações',
  'Describe Image: Comparações e Proporções',
  'Describe Image: Processos, Ciclos e Mapas',
  'Retell Lecture / SST: Ideia Central',
  'Retell Lecture / SST: Enfatizando Pontos',
  'Retell Lecture / SST: Transições e Contrapontos',
  'Retell Lecture / SST: Conclusão do Orador',
  'Write Essay: Evidências e Argumentos',
  'Write Essay: Causa, Efeito e Soluções',
  'Collocations de Ouro do PTE Academic',
  'Write From Dictation & Repeat Sentence Chunks',
];

// Entradas transcritas fielmente das amostras legíveis do material-fonte.
// As demais entradas de cada módulo e os módulos sem transcrição confirmada
// permanecem como "pendente de conteúdo" (Req 8.4) — nunca inventados.
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
  2: [
    {
      id: 'm02-e01',
      english: 'Rising global temperatures.',
      practicalPronunciation: 'rái-zin glôu-bal têm-pe-ra-tchurs',
      translationPtBr: 'Aumento das temperaturas globais.',
    },
    {
      id: 'm02-e02',
      english: 'Greenhouse gas emissions.',
      practicalPronunciation: 'gríin-ráus gués i-mí-xâns',
      translationPtBr: 'Emissões de gases do efeito estufa.',
    },
  ],
  8: [
    {
      id: 'm08-e01',
      english: 'Machine learning algorithms.',
      practicalPronunciation: 'ma-xíin lâr-nin él-go-ri-dems',
      translationPtBr: 'Algoritmos de aprendizado de máquina.',
    },
  ],
  38: [
    {
      id: 'm38-e01',
      english: 'Significant increase over time.',
      practicalPronunciation: 'sig-ní-fi-cent ín-críis ou-ver táim',
      translationPtBr: 'Aumento significativo ao longo do tempo.',
    },
    {
      id: 'm38-e02',
      english: 'Reach a peak in 2020.',
      practicalPronunciation: 'ríitch a píik in tuén-ti tuén-ti',
      translationPtBr: 'Atingir um pico em 2020.',
    },
  ],
  49: [
    {
      id: 'm49-e01',
      english: 'Conduct extensive scientific research.',
      practicalPronunciation: 'côn-dãct eks-tên-siv sai-en-tí-fic ri-sãrtch',
      translationPtBr: 'Conduzir ampla pesquisa científica.',
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
