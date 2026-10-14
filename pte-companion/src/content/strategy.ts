import type { StrategyChapter } from './types';

// Guia de Estratégias — capítulos derivados da "PTE Academic 2026 Definitive 79+ Masterclass".
// Conteúdo em PT-BR com termos técnicos em inglês onde apropriado.
// A matriz 80/20 é renderizada a partir do campo `tier` das 22 tarefas (ver content/tasks.ts).

export const STRATEGY_CHAPTERS: StrategyChapter[] = [
  {
    id: 'algorithm-logic',
    title: 'Lógica do algoritmo de pontuação',
    order: 1,
    bodyMarkdown: `## Como o PTE Academic pontua você

O PTE Academic é corrigido por um **algoritmo automático**, não por humanos. Isso muda a estratégia: você não precisa impressionar um examinador, precisa **alimentar o algoritmo** com os sinais que ele mede.

### Os 3 pilares do Speaking

1. **Oral Fluency (Fluência oral):** falar de forma contínua, sem pausas longas, sem repetições e sem autocorreções. Falar em *chunks* (blocos) ajuda a manter o ritmo.
2. **Pronunciation (Pronúncia):** sons claros e reconhecíveis. Não precisa de sotaque nativo, precisa ser **inteligível** para a máquina.
3. **Content (Conteúdo):** dizer as palavras-chave esperadas. Mesmo com fluência perfeita, sem conteúdo relevante a nota cai.

> Regra de ouro: **fluência + pronúncia > conteúdo** na maioria das tarefas de fala. Nunca pare no meio de uma frase para "acertar" uma palavra.

### Pontuação integrada (integrated scoring)

Uma única tarefa pode alimentar várias habilidades. Ex.: *Read Aloud* contribui para **Speaking e Reading**. Por isso tarefas "ouro" rendem pontos em mais de uma seção.`,
  },
  {
    id: 'chunking',
    title: 'Chunking: falar e ler em blocos',
    order: 2,
    bodyMarkdown: `## O que é chunking

*Chunking* é agrupar palavras em **blocos de sentido** e fazer micro-pausas entre eles, em vez de ler/falar palavra por palavra.

### Exemplo

Texto: \`The rapid growth of technology has transformed modern education.\`

Com chunking:

\`The rapid growth of technology / has transformed / modern education.\`

- Melhora a **fluência oral** (ritmo natural).
- Reduz o risco de travar.
- Soa mais natural para o algoritmo.

### Como treinar

1. Marque as barras de chunk no texto durante o tempo de preparação.
2. Respire no início de cada bloco.
3. Mantenha volume e velocidade constantes.`,
  },
  {
    id: 'pareto-8020',
    title: 'Matriz 80/20 (Pareto): tarefas ouro vs lixo',
    order: 3,
    bodyMarkdown: `## Onde investir seu tempo

O princípio de **Pareto (80/20)** aplicado ao PTE: ~20% das tarefas geram ~80% dos seus pontos. Concentre o treino nas tarefas **OURO** e não desperdice energia nas tarefas **LIXO**.

A classificação visual completa (ouro / lixo / neutro) de cada uma das 22 tarefas aparece no topo deste pilar, derivada diretamente dos parâmetros das tarefas.

### Tarefas OURO (alto impacto)
- **Write From Dictation** — altíssimo peso, previsível, treinável.
- **Read Aloud** — alimenta Speaking e Reading.
- **Repeat Sentence** — alimenta Speaking e Listening; 50-60% da frase já pontua.
- **R&W Fill in the Blanks (Dropdowns)** — alto peso em Reading, previsível.

### Tarefas LIXO (baixo retorno)
- **Multiple Choice (Single e Multiple Answer)** — baixo peso e, no Multiple Answer, **pontuação negativa** por erro.
- **Highlight Correct Summary** — baixo retorno.
- **Select Missing Word** — baixo retorno.

### Tarefas neutras (base de templates)
Descreva imagem, Re-tell Lecture, Write Essay, Summarize Written Text etc. — rendem bem com **templates** memorizados.`,
  },
  {
    id: 'phonetics-brazilians',
    title: 'Fonética para brasileiros: os 8 vícios',
    order: 4,
    bodyMarkdown: `## Os 8 vícios de pronúncia mais comuns do brasileiro

Corrija estes pontos e sua nota de **Pronunciation** sobe rápido. Use a coluna "Pronúncia Prática" como dica.

| # | Vício | Exemplo errado | Correção (Pronúncia Prática) |
|---|-------|----------------|------------------------------|
| 1 | "-ED" vira "-edji" | *liked* → "laikedji" | "laikt" (som /t/ seco) |
| 2 | "-TION" vira "-tchion" | *education* → "edju-tchion" | "é-dju-kei-shon" (/ʃ/) |
| 3 | "H" mudo em início | *house* → "aus" | "ráus" (H aspirado) |
| 4 | "TH" vira "T/D/F" | *think* → "tink" | "θink" (língua entre os dentes) |
| 5 | Epêntese de vogal | *sport* → "esporti" | "spôrt" (sem "e" inicial, sem "i" final) |
| 6 | "R" caipira | *water* → "uóterr" | "uó-ter" (R suave americano) |
| 7 | "-M/-N" nasal final | *time* → "taimi" | "táim" (fechar a boca, sem vogal extra) |
| 8 | Vogais abertas demais | *bad* vs *bed* | distinga /æ/ (bad) de /ɛ/ (bed) |

> Dica: grave sua voz no pilar **Treino de Tarefas** e compare com estes padrões (autorrevisão).`,
  },
  {
    id: 'us-uk-spelling',
    title: 'Tabela US vs UK spelling',
    order: 5,
    bodyMarkdown: `## US vs UK: seja consistente

Escolha **um** padrão (recomendado: US) e **nunca misture** na mesma resposta. Misturar grafias prejudica a nota de Writing.

| US (recomendado) | UK |
|------------------|----|
| color | colour |
| behavior | behaviour |
| organize | organise |
| analyze | analyse |
| center | centre |
| theater | theatre |
| traveling | travelling |
| defense | defence |
| program | programme |
| catalog | catalogue |
| favorite | favourite |
| labor | labour |`,
  },
  {
    id: 'academic-connectors',
    title: 'Conectores acadêmicos',
    order: 6,
    bodyMarkdown: `## Conectores para Writing e Speaking

Use conectores para organizar ideias e ganhar pontos de coesão.

### Adição
- Furthermore, / Moreover, / In addition,

### Contraste
- However, / On the other hand, / Nevertheless,

### Causa e efeito
- Therefore, / As a result, / Consequently,

### Exemplo
- For instance, / For example, / To illustrate,

### Conclusão
- In conclusion, / To sum up, / Overall,

> Em SWT (frase única) **não** use conectores de início de frase que exijam novo ponto — mantenha tudo em uma frase só.`,
  },
  {
    id: 'grammar-blacklist',
    title: 'Lista negra de gramática',
    order: 7,
    bodyMarkdown: `## Erros que derrubam a nota de Writing

### Substantivos incontáveis (uncountable nouns)
Nunca use no plural nem com "a/an":
- *information* (não "informations")
- *research* (não "researches")
- *advice*, *knowledge*, *equipment*, *furniture*, *money*, *progress*

### Concordância verbo-sujeito (subject-verb agreement)
- *The number of students **is** increasing.* (número = singular)
- *A list of items **was** provided.*

### Regra da frase única no SWT
**Summarize Written Text** exige **UMA única frase** com **um único ponto final**. Dois pontos finais = nota zero no critério de forma. Use vírgulas, "which", "while" e ";" para encadear.

### Artigos
Use "the" para referência específica; omita artigo com substantivos incontáveis/plurais genéricos (*Education is important.*).`,
  },
  {
    id: 'faqs',
    title: 'FAQs (Perguntas frequentes)',
    order: 8,
    bodyMarkdown: `## 10 perguntas frequentes

1. **Preciso de sotaque nativo?** Não. Precisa ser **inteligível**. Clareza > sotaque.
2. **Posso usar templates?** Sim, nas tarefas neutras. São esperados e recomendados.
3. **Repeat Sentence: e se eu esquecer parte?** Repita 50-60% com fluência; já pontua bem.
4. **Devo me preocupar com Multiple Choice?** Pouco. São tarefas LIXO (baixo peso, risco de nota negativa).
5. **SWT: posso usar dois pontos finais?** Não. Apenas **um**. É a regra da frase única.
6. **Essay: quantas palavras?** 250-280 (conforme Apêndice E). Fora da faixa penaliza.
7. **Posso corrigir no meio da fala?** Evite. Autocorreção derruba a fluência. Siga em frente.
8. **O app me dá nota?** Não. É **autorrevisão** — não há nota automática estilo Pearson.
9. **E se o microfone não funcionar?** O treino segue sem gravação; timers continuam.
10. **Com que frequência revisar o vocabulário?** Diariamente, seguindo a fila SRS ("Revisão de hoje").`,
  },
  {
    id: 'test-center-mic-protocol',
    title: 'Protocolo de test-center e microfone',
    order: 9,
    bodyMarkdown: `## No dia da prova

### Antes de começar
- Teste o microfone no *headset* fornecido. Fale "Testing, testing" e confirme que o nível de áudio sobe.
- Ajuste o microfone a ~2 dedos de distância da boca, levemente abaixo do nariz (evita estouro em "p" e "b").

### Durante o Speaking
- Comece a falar **imediatamente** após o tom/beep. O microfone fecha sozinho após alguns segundos de silêncio — **silêncio = fim da gravação**.
- Fale com volume **constante e firme**.

### Gestão de tempo
- Use **todo** o tempo de preparação para marcar chunks e palavras-chave.
- Não deixe o cronômetro de resposta zerar em silêncio.

> Pratique este protocolo no pilar **Treino de Tarefas** com os timers reais e a gravação de voz.`,
  },
];
