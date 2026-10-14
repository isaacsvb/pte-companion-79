import type { PteTask } from './types';

// 22 tarefas oficiais do PTE Academic.
// Fonte de verdade: "Tabela Mestra de Execução" (Apêndice E) do PDF
// "PTE Academic 2026 Definitive 79+ Masterclass".
// Onde os limites de palavras divergem entre PDFs, prevalece o Apêndice E.
//
// Matriz 80/20 (campo `tier`):
//   gold    = alto impacto / alto retorno
//   junk    = baixo retorno (inclui tarefas com pontuação negativa)
//   neutral = base de templates (impacto médio)

// Personal Introduction NÃO é pontuada pelo algoritmo (serve de aquecimento),
// por isso fica fora das 22 tarefas oficiais pontuadas, mas é exposta para treino.
export const PERSONAL_INTRODUCTION: PteTask = {
  id: 'personal-introduction',
  name: 'Personal Introduction',
  part: 'speaking',
  prepSeconds: 25,
  responseSeconds: 30,
  timing: '25s preparação / 30s resposta',
  wordRule: 'até 50 palavras',
  wordLimit: { max: 50 },
  requiresMic: true,
  tier: 'neutral',
  isWriting: false,
  description:
    'Apresentação pessoal. Não é pontuada pelo algoritmo, mas serve de aquecimento. Fale de forma clara dentro do tempo.',
};

// 22 tarefas oficiais PONTUADAS.
export const TASKS: PteTask[] = [
  // ---------- SPEAKING ----------
  {
    id: 'read-aloud',
    name: 'Read Aloud',
    part: 'speaking',
    prepSeconds: 40,
    responseSeconds: 40,
    timing: '35-40s preparação / 35-40s resposta',
    wordRule: 'texto de até 60 palavras',
    wordLimit: { max: 60 },
    requiresMic: true,
    tier: 'gold',
    isWriting: false,
    description:
      'Leia o texto em voz alta. Avalia Speaking + Reading. Foque em fluência oral e pronúncia (chunking).',
  },
  {
    id: 'repeat-sentence',
    name: 'Repeat Sentence',
    part: 'speaking',
    prepSeconds: null,
    responseSeconds: 9,
    timing: 'sem preparação / 3-9s resposta',
    wordRule: 'repetir 50-60% da frase já pontua',
    requiresMic: true,
    tier: 'gold',
    isWriting: false,
    description:
      'Ouça e repita a frase. Avalia Speaking + Listening. Repetir 50-60% da frase corretamente já garante boa pontuação.',
  },
  {
    id: 'describe-image',
    name: 'Describe Image',
    part: 'speaking',
    prepSeconds: 25,
    responseSeconds: 35,
    timing: '25s preparação / 30-35s resposta',
    wordRule: 'estrutura flexível (use o template)',
    requiresMic: true,
    tier: 'neutral',
    isWriting: false,
    description:
      'Descreva a imagem. Avalia Speaking. Use o template de 4 passos para preencher o tempo com fluência.',
  },
  {
    id: 're-tell-lecture',
    name: 'Re-tell Lecture',
    part: 'speaking',
    prepSeconds: 10,
    responseSeconds: 35,
    timing: '10s preparação / 30-35s resposta',
    wordRule: '4-6 chunks de conteúdo',
    requiresMic: true,
    tier: 'neutral',
    isWriting: false,
    description:
      'Ouça a palestra e reconte. Avalia Speaking + Listening. Capture 4-6 chunks de conteúdo e encaixe no template.',
  },
  {
    id: 'summarize-group-discussion',
    name: 'Summarize Group Discussion',
    part: 'speaking',
    prepSeconds: 10,
    responseSeconds: 35,
    timing: '10s preparação / 30-35s resposta',
    wordRule: 'resuma os pontos dos interlocutores',
    requiresMic: true,
    tier: 'neutral',
    isWriting: false,
    description:
      'Resuma uma discussão em grupo. Avalia Speaking + Listening. Capture a posição de cada participante.',
  },
  {
    id: 'respond-to-a-situation',
    name: 'Respond to a Situation',
    part: 'speaking',
    prepSeconds: 20,
    responseSeconds: 40,
    timing: '20s preparação / 40s resposta',
    wordRule: 'resposta situacional estruturada',
    requiresMic: true,
    tier: 'neutral',
    isWriting: false,
    description:
      'Responda a uma situação proposta. Avalia Speaking. Use o template de resposta situacional.',
  },
  {
    id: 'answer-short-question',
    name: 'Answer Short Question',
    part: 'speaking',
    prepSeconds: null,
    responseSeconds: 2,
    timing: 'sem preparação / 1-2s resposta',
    wordRule: '1 palavra',
    wordLimit: { max: 1 },
    requiresMic: true,
    tier: 'neutral',
    isWriting: false,
    description:
      'Responda com uma única palavra. Avalia Speaking + Listening. Resposta curta e objetiva.',
  },

  // ---------- WRITING ----------
  {
    id: 'summarize-written-text',
    name: 'Summarize Written Text',
    part: 'writing',
    prepSeconds: null,
    responseSeconds: 600,
    timing: '10 minutos no total',
    wordRule: '35-50 palavras, UMA única frase',
    wordLimit: { min: 35, max: 50 },
    requiresMic: false,
    tier: 'neutral',
    isWriting: true,
    description:
      'Resuma o texto em UMA única frase de 35-50 palavras. Avalia Writing + Reading. Use um único ponto final (regra da frase única).',
  },
  {
    id: 'write-essay',
    name: 'Write Essay',
    part: 'writing',
    prepSeconds: null,
    responseSeconds: 1200,
    timing: '20 minutos no total',
    wordRule: '250-280 palavras',
    wordLimit: { min: 250, max: 280 },
    requiresMic: false,
    tier: 'neutral',
    isWriting: true,
    description:
      'Escreva uma redação de 250-280 palavras. Avalia Writing. Use o template blindado de 4 parágrafos.',
  },

  // ---------- READING ----------
  {
    id: 'rw-fill-in-the-blanks',
    name: 'Reading & Writing: Fill in the Blanks (Dropdowns)',
    part: 'reading',
    prepSeconds: null,
    responseSeconds: 120,
    timing: '~2 min por texto',
    wordRule: '4-5 lacunas (menus suspensos)',
    requiresMic: false,
    tier: 'gold',
    isWriting: false,
    description:
      'Preencha 4-5 lacunas escolhendo nos menus suspensos. Avalia Reading. Tarefa OURO: alto peso e alta previsibilidade.',
  },
  {
    id: 'mc-multiple-answer-reading',
    name: 'Multiple Choice, Multiple Answer (Reading)',
    part: 'reading',
    prepSeconds: null,
    responseSeconds: 30,
    timing: '~30s',
    wordRule: 'múltiplas respostas — pontuação negativa',
    requiresMic: false,
    tier: 'junk',
    isWriting: false,
    description:
      'Selecione todas as alternativas corretas. Avalia Reading. Tarefa LIXO: pontuação negativa por erro — baixo retorno.',
  },
  {
    id: 're-order-paragraphs',
    name: 'Re-order Paragraphs',
    part: 'reading',
    prepSeconds: null,
    responseSeconds: 120,
    timing: '~2 min por texto',
    wordRule: 'ordenar parágrafos',
    requiresMic: false,
    tier: 'neutral',
    isWriting: false,
    description:
      'Reordene os parágrafos na sequência lógica. Avalia Reading.',
  },
  {
    id: 'reading-fib-drag-drop',
    name: 'Reading: Fill in the Blanks (Drag & Drop)',
    part: 'reading',
    prepSeconds: null,
    responseSeconds: 120,
    timing: '~2 min por texto',
    wordRule: 'arrastar palavras para as lacunas',
    requiresMic: false,
    tier: 'neutral',
    isWriting: false,
    description:
      'Arraste as palavras para as lacunas corretas. Avalia Reading.',
  },
  {
    id: 'mc-single-answer-reading',
    name: 'Multiple Choice, Single Answer (Reading)',
    part: 'reading',
    prepSeconds: null,
    responseSeconds: 15,
    timing: '~15s',
    wordRule: 'uma resposta',
    requiresMic: false,
    tier: 'junk',
    isWriting: false,
    description:
      'Selecione a única alternativa correta. Avalia Reading. Tarefa LIXO: baixo peso.',
  },

  // ---------- LISTENING ----------
  {
    id: 'summarize-spoken-text',
    name: 'Summarize Spoken Text',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 600,
    timing: '10 minutos no total',
    wordRule: '50-70 palavras',
    wordLimit: { min: 50, max: 70 },
    requiresMic: false,
    tier: 'neutral',
    isWriting: true,
    description:
      'Resuma o áudio em 50-70 palavras. Avalia Listening + Writing. Use o esqueleto de template de 50-70 palavras.',
  },
  {
    id: 'mc-multiple-answer-listening',
    name: 'Multiple Choice, Multiple Answer (Listening)',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 15,
    timing: '~15s',
    wordRule: 'múltiplas respostas — pontuação negativa',
    requiresMic: false,
    tier: 'junk',
    isWriting: false,
    description:
      'Selecione todas as alternativas corretas. Avalia Listening. Tarefa LIXO: pontuação negativa por erro.',
  },
  {
    id: 'fill-in-the-blanks-listening',
    name: 'Fill in the Blanks (Listening)',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 60,
    timing: 'durante o áudio',
    wordRule: 'digitar as palavras faltantes',
    requiresMic: false,
    tier: 'neutral',
    isWriting: true,
    description:
      'Digite as palavras faltantes enquanto ouve o áudio. Avalia Listening + Writing.',
  },
  {
    id: 'highlight-correct-summary',
    name: 'Highlight Correct Summary',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 15,
    timing: '~15s',
    wordRule: 'escolher o resumo correto',
    requiresMic: false,
    tier: 'junk',
    isWriting: false,
    description:
      'Escolha o resumo que melhor representa o áudio. Avalia Listening + Reading. Tarefa LIXO: baixo retorno.',
  },
  {
    id: 'mc-single-answer-listening',
    name: 'Multiple Choice, Single Answer (Listening)',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 15,
    timing: '~15s',
    wordRule: 'uma resposta',
    requiresMic: false,
    tier: 'junk',
    isWriting: false,
    description:
      'Selecione a única alternativa correta. Avalia Listening. Tarefa LIXO: baixo peso.',
  },
  {
    id: 'select-missing-word',
    name: 'Select Missing Word',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 5,
    timing: '~5s',
    wordRule: 'escolher a palavra que falta',
    requiresMic: false,
    tier: 'junk',
    isWriting: false,
    description:
      'Escolha a palavra/frase que completa o áudio. Avalia Listening. Tarefa LIXO: baixo retorno.',
  },
  {
    id: 'highlight-incorrect-words',
    name: 'Highlight Incorrect Words',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 60,
    timing: 'durante o áudio',
    wordRule: 'marcar palavras erradas — pontuação negativa',
    requiresMic: false,
    tier: 'neutral',
    isWriting: false,
    description:
      'Marque as palavras do texto que divergem do áudio. Avalia Listening + Reading, com pontuação negativa por erro.',
  },
  {
    id: 'write-from-dictation',
    name: 'Write From Dictation',
    part: 'listening',
    prepSeconds: null,
    responseSeconds: 5,
    timing: '3-5s por frase',
    wordRule: 'digitar a frase ouvida',
    requiresMic: false,
    tier: 'gold',
    isWriting: true,
    description:
      'Ouça e digite exatamente a frase. Avalia Listening + Writing. Tarefa OURO: altíssimo peso e previsível.',
  },
];

// Para o treino, Personal Introduction aparece como aquecimento antes das tarefas de Speaking.
export const TRAINER_TASKS: PteTask[] = [PERSONAL_INTRODUCTION, ...TASKS];

export const TASKS_BY_PART: Record<string, PteTask[]> = TRAINER_TASKS.reduce(
  (acc, task) => {
    (acc[task.part] ||= []).push(task);
    return acc;
  },
  {} as Record<string, PteTask[]>,
);

export const PART_LABELS: Record<string, string> = {
  speaking: 'Speaking (Fala)',
  writing: 'Writing (Escrita)',
  reading: 'Reading (Leitura)',
  listening: 'Listening (Compreensão auditiva)',
};
