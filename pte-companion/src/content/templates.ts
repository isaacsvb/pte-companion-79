import type { TemplateDef } from './types';

// Templates Universais — derivados do "PTE Academic PR Master Guide" e da Masterclass.
// Placeholders demarcados com colchetes: [CHAVE].
// Limites de palavras alinhados ao Apêndice E (Tabela Mestra de Execução).

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'describe-image',
    taskName: 'Describe Image',
    description: 'Template de 4 passos para preencher o tempo com fluência.',
    body: `This image shows [TIPO_DE_IMAGEM] about [TÓPICO]. The most noticeable feature is [DESTAQUE_1]. In addition, we can see [DESTAQUE_2] and [DESTAQUE_3]. Overall, the image suggests that [CONCLUSÃO].`,
    placeholders: [
      { key: 'TIPO_DE_IMAGEM', label: 'Tipo de imagem', hint: 'ex.: a bar chart, a map, a diagram' },
      { key: 'TÓPICO', label: 'Tópico', hint: 'o assunto geral da imagem' },
      { key: 'DESTAQUE_1', label: 'Destaque 1', hint: 'o dado/elemento mais evidente' },
      { key: 'DESTAQUE_2', label: 'Destaque 2' },
      { key: 'DESTAQUE_3', label: 'Destaque 3' },
      { key: 'CONCLUSÃO', label: 'Conclusão', hint: 'tendência ou ideia principal' },
    ],
  },
  {
    id: 're-tell-lecture',
    taskName: 'Re-tell Lecture',
    description: 'Encaixe 4-6 chunks de conteúdo capturados da palestra.',
    body: `The lecture was mainly about [TÓPICO]. The speaker first mentioned [PONTO_1]. Then, the speaker discussed [PONTO_2]. The speaker also pointed out [PONTO_3]. In conclusion, the lecture highlighted that [CONCLUSÃO].`,
    placeholders: [
      { key: 'TÓPICO', label: 'Tópico da palestra' },
      { key: 'PONTO_1', label: 'Ponto 1' },
      { key: 'PONTO_2', label: 'Ponto 2' },
      { key: 'PONTO_3', label: 'Ponto 3' },
      { key: 'CONCLUSÃO', label: 'Conclusão' },
    ],
  },
  {
    id: 'summarize-group-discussion',
    taskName: 'Summarize Group Discussion',
    description: 'Capture a posição de cada participante da discussão.',
    body: `The discussion focused on [TÓPICO]. The first speaker argued that [POSIÇÃO_1]. The second speaker, however, believed that [POSIÇÃO_2]. In the end, they [CONSENSO_OU_DIVERGÊNCIA].`,
    placeholders: [
      { key: 'TÓPICO', label: 'Tópico da discussão' },
      { key: 'POSIÇÃO_1', label: 'Posição do 1º participante' },
      { key: 'POSIÇÃO_2', label: 'Posição do 2º participante' },
      { key: 'CONSENSO_OU_DIVERGÊNCIA', label: 'Consenso ou divergência', hint: 'ex.: agreed that..., disagreed about...' },
    ],
  },
  {
    id: 'respond-to-a-situation',
    taskName: 'Respond to a Situation',
    description: 'Resposta situacional estruturada e educada.',
    body: `Hello, I'm calling about [SITUAÇÃO]. I would like to [PEDIDO_OU_AÇÃO]. The reason is that [JUSTIFICATIVA]. Could you please [SOLICITAÇÃO_FINAL]? Thank you very much.`,
    placeholders: [
      { key: 'SITUAÇÃO', label: 'Situação', hint: 'o contexto apresentado' },
      { key: 'PEDIDO_OU_AÇÃO', label: 'Pedido ou ação' },
      { key: 'JUSTIFICATIVA', label: 'Justificativa' },
      { key: 'SOLICITAÇÃO_FINAL', label: 'Solicitação final' },
    ],
  },
  {
    id: 'summarize-written-text',
    taskName: 'Summarize Written Text (SWT)',
    description: 'Fórmula A/B — UMA única frase de 35-50 palavras, com um único ponto final.',
    body: `While [IDEIA_PRINCIPAL], the author also explains that [IDEIA_SECUNDÁRIA], which demonstrates that [CONCLUSÃO].`,
    placeholders: [
      { key: 'IDEIA_PRINCIPAL', label: 'Ideia principal do texto' },
      { key: 'IDEIA_SECUNDÁRIA', label: 'Ideia secundária / de apoio' },
      { key: 'CONCLUSÃO', label: 'Conclusão / implicação' },
    ],
    wordLimit: { min: 35, max: 50 },
  },
  {
    id: 'write-essay',
    taskName: 'Write Essay',
    description: 'Template blindado de 4 parágrafos (250-280 palavras).',
    body: `It is often argued that [TEMA]. While some people believe [VISÃO_A], others maintain that [VISÃO_B]. This essay will discuss both perspectives before giving my opinion.

On the one hand, [ARGUMENTO_1]. For instance, [EXEMPLO_1]. This clearly shows why many people support this view.

On the other hand, [ARGUMENTO_2]. A good example is [EXEMPLO_2]. Therefore, this perspective also has strong merit.

In conclusion, although both sides present valid points, I firmly believe that [OPINIÃO_FINAL]. Overall, [FECHAMENTO].`,
    placeholders: [
      { key: 'TEMA', label: 'Tema da redação' },
      { key: 'VISÃO_A', label: 'Visão A' },
      { key: 'VISÃO_B', label: 'Visão B' },
      { key: 'ARGUMENTO_1', label: 'Argumento 1' },
      { key: 'EXEMPLO_1', label: 'Exemplo 1' },
      { key: 'ARGUMENTO_2', label: 'Argumento 2' },
      { key: 'EXEMPLO_2', label: 'Exemplo 2' },
      { key: 'OPINIÃO_FINAL', label: 'Opinião final' },
      { key: 'FECHAMENTO', label: 'Fechamento' },
    ],
    wordLimit: { min: 250, max: 280 },
  },
  {
    id: 'summarize-spoken-text',
    taskName: 'Summarize Spoken Text (SST)',
    description: 'Esqueleto de 50-70 palavras para resumir o áudio.',
    body: `The speaker discussed [TÓPICO]. According to the lecture, [PONTO_1]. Furthermore, the speaker mentioned that [PONTO_2]. It was also stated that [PONTO_3]. In conclusion, the talk emphasized that [CONCLUSÃO].`,
    placeholders: [
      { key: 'TÓPICO', label: 'Tópico do áudio' },
      { key: 'PONTO_1', label: 'Ponto 1' },
      { key: 'PONTO_2', label: 'Ponto 2' },
      { key: 'PONTO_3', label: 'Ponto 3' },
      { key: 'CONCLUSÃO', label: 'Conclusão' },
    ],
    wordLimit: { min: 50, max: 70 },
  },
];
