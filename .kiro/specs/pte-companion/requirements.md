# Requisitos — PTE Companion 79+

## Visão geral

Aplicativo web (SPA em React) de uso pessoal para ajudar um candidato brasileiro a atingir **PTE Academic 79+**, usando como fonte de conteúdo os três materiais de estudo fornecidos pelo próprio usuário:

1. **PTE Academic 2026 Definitive 79+ Masterclass** — as 22 tarefas oficiais, templates universais, matriz 80/20, plano de 90 dias, guia de fonética para brasileiros, dicionário de collocations e lista negra de gramática.
2. **Inglês Real – 500 Expressões / Foco PTE Academic** — 50 módulos de vocabulário/chunks (Inglês + "Pronúncia Prática" + Tradução) e guia de uso do Anki/repetição espaçada.
3. **PTE Academic PR Master Guide** — templates blindados de Essay / SWT / SST / Describe Image / Re-tell Lecture e a Tabela Mestra de Execução.

### Princípios e restrições de produto (decisões já tomadas)

- **Plataforma:** aplicação web React (SPA). Sem backend/servidor na v1.
- **Persistência:** apenas `localStorage` do navegador. Sem login, sem autenticação, sem nuvem, sem contas. O progresso é por dispositivo.
- **Idioma:** interface (UI) em **Português (Brasil)**; o conteúdo de estudo permanece em **Inglês** onde fizer sentido (chunks, templates, exemplos), com apoio em PT-BR (traduções, "Pronúncia Prática", explicações).
- **Speaking:** gravar e reproduzir a própria voz (APIs `getUserMedia` / `MediaRecorder`) + timers que imitam os tempos reais de preparação/resposta de cada tarefa. **NÃO** prometer nem implementar "nota automática" estilo IA da Pearson. A avaliação é **autorrevisão** (self-review).
- **Fonte de conteúdo:** exclusivamente o material do próprio usuário. **Não** copiar, replicar ou imitar produtos pagos de terceiros (ex.: AlfaPTE).
- **Escopo da spec:** esta spec define o produto; a implementação de código é uma etapa posterior e separada.

### Terminologia (EARS)

Os requisitos abaixo usam a notação EARS. "SISTEMA" refere-se ao aplicativo. "Usuário" é o candidato.

---

## Requisito 1 — Navegação e estrutura do app

**User story:** Como candidato, quero navegar entre os pilares do app (Dashboard, Guia de Estratégias, Vocabulário, Templates, Treino de Tarefas, Plano de Batalha) por uma navegação clara em PT-BR, para encontrar rapidamente o que preciso estudar.

#### Acceptance Criteria

1. QUANDO o usuário abre o app, O SISTEMA DEVE exibir uma navegação persistente com acesso a: Dashboard, Guia de Estratégias, Vocabulário (500 Chunks), Templates Universais, Treino de Tarefas e Plano de Batalha.
2. O SISTEMA DEVE apresentar todos os rótulos de interface, menus, botões e mensagens em Português (Brasil).
3. QUANDO o usuário seleciona um pilar, O SISTEMA DEVE roteá-lo para a seção correspondente mantendo a navegação visível (SPA, sem recarregar a página).
4. QUANDO o usuário recarrega a página em qualquer rota, O SISTEMA DEVE restaurar a mesma seção (rota persistente).
5. O SISTEMA DEVE ser responsivo e utilizável em desktop e em telas de celular.

---

## Requisito 2 — Guia de Estratégias

**User story:** Como candidato, quero ler os capítulos de estratégia do meu material (lógica do algoritmo, chunking, matriz 80/20, fonética para brasileiros, lista negra de gramática, conectores acadêmicos, US vs UK e FAQs), para entender como a prova pontua e onde investir meu tempo.

#### Acceptance Criteria

1. O SISTEMA DEVE exibir os capítulos de estratégia organizados em uma lista/índice navegável, incluindo pelo menos: lógica do algoritmo de pontuação, chunking, matriz 80/20 (tarefas "ouro" vs tarefas "lixo"), fonética para brasileiros (os 8 vícios comuns), tabela US vs UK spelling, conectores acadêmicos, lista negra de gramática (ex.: substantivos incontáveis) e FAQs.
2. QUANDO o usuário seleciona um capítulo, O SISTEMA DEVE exibir seu conteúdo formatado (títulos, listas, tabelas) e legível em PT-BR com termos técnicos em inglês onde apropriado.
3. A matriz 80/20 DEVE classificar visualmente cada tipo de tarefa como "ouro" (alto impacto) ou "lixo"/baixo retorno, conforme o material.
4. O capítulo de fonética DEVE listar os 8 vícios comuns de brasileiros com exemplos e a correção da "Pronúncia Prática".
5. A tabela US vs UK DEVE apresentar pares de grafia (ex.: color/colour) de forma consultável.
6. QUANDO o usuário marca um capítulo como lido, O SISTEMA DEVE registrar esse estado e persisti-lo (ver Requisito 7).

---

## Requisito 3 — Vocabulário / 500 Chunks com repetição espaçada (SRS)

**User story:** Como candidato, quero estudar os 50 módulos de vocabulário (cada um com ~10 entradas de Inglês + "Pronúncia Prática" + Tradução) usando flashcards de repetição espaçada estilo Anki, para memorizar os chunks de forma eficiente.

#### Acceptance Criteria

1. O SISTEMA DEVE apresentar os 50 módulos de vocabulário em uma lista navegável, cada um com seu conjunto de entradas.
2. CADA entrada DEVE conter: a expressão/chunk em Inglês, a "Pronúncia Prática" (dica fonética para brasileiros) e a Tradução em PT-BR.
3. QUANDO o usuário inicia uma sessão de flashcards, O SISTEMA DEVE apresentar os cartões um a um, mostrando primeiro um lado e revelando o verso sob demanda.
4. QUANDO o usuário avalia o quão bem lembrou de um cartão, O SISTEMA DEVE registrar essa avaliação e reagendar o cartão segundo um algoritmo de repetição espaçada (estilo Anki / SM-2 simplificado).
5. QUANDO o usuário abre a seção de estudo diário, O SISTEMA DEVE apresentar os cartões "due" (vencidos para revisão hoje) com base no agendamento SRS.
6. O SISTEMA DEVE permitir estudar por módulo específico ou uma fila mista de cartões vencidos.
7. O estado de SRS de cada cartão (intervalo, facilidade, próxima revisão, histórico) DEVE ser persistido (ver Requisito 7).
8. O SISTEMA DEVE exibir, por módulo e no total, contagens de cartões novos, em aprendizado e dominados.

---

## Requisito 4 — Templates Universais preenchíveis

**User story:** Como candidato, quero consultar e praticar os templates universais (Describe Image, Write Essay, Summarize Written Text, Summarize Spoken Text, Re-tell Lecture, Respond to a Situation, Summarize Group Discussion), com os placeholders que preencho, para montar respostas estruturadas rapidamente.

#### Acceptance Criteria

1. O SISTEMA DEVE listar os templates universais disponíveis, no mínimo: Describe Image, Write Essay, Summarize Written Text (SWT), Summarize Spoken Text (SST), Re-tell Lecture, Respond to a Situation e Summarize Group Discussion.
2. CADA template DEVE exibir o texto-base com os placeholders claramente demarcados (ex.: `[TÓPICO]`, `[PALAVRA-CHAVE 1]`).
3. QUANDO o usuário preenche os placeholders de um template, O SISTEMA DEVE compor e exibir o texto final montado em tempo real.
4. QUANDO o template possui um limite de palavras aplicável (ex.: SWT 5–75 palavras, Essay 200–300 palavras), O SISTEMA DEVE exibir a contagem de palavras do texto montado e sinalizar quando estiver fora da faixa.
5. O SISTEMA DEVE permitir copiar o texto final montado para a área de transferência.
6. O SISTEMA DEVE permitir salvar os preenchimentos do usuário por template, persistindo-os (ver Requisito 7).

---

## Requisito 5 — Treino de Tarefas (22 tarefas) com timers reais e gravação de voz

**User story:** Como candidato, quero praticar cada uma das 22 tarefas oficiais com os timers reais de preparação/resposta e limites de palavras da prova, e gravar/reproduzir minha voz nas tarefas de fala, para treinar sob condições próximas às reais e me autoavaliar.

#### Acceptance Criteria

1. O SISTEMA DEVE listar as 22 tarefas oficiais do PTE Academic, agrupadas por parte (Speaking, Writing, Reading, Listening), usando a **Tabela Mestra de Execução** do material como fonte de verdade para tempos e limites.
2. CADA tarefa DEVE registrar seus parâmetros: tempo de preparação, tempo de resposta e limite de palavras/caracteres quando aplicável.
3. QUANDO o usuário inicia o treino de uma tarefa com tempo de preparação, O SISTEMA DEVE exibir uma contagem regressiva de preparação e, ao término, transicionar automaticamente para a fase de resposta.
4. QUANDO o usuário está na fase de resposta de uma tarefa, O SISTEMA DEVE exibir um timer (regressivo ou de tempo decorrido conforme a tarefa) consistente com os tempos da tarefa.
5. QUANDO a tarefa é de fala (ex.: Read Aloud, Repeat Sentence, Describe Image, Re-tell Lecture, Answer Short Question, Respond to a Situation), O SISTEMA DEVE solicitar permissão de microfone e, concedida, gravar o áudio durante a fase de resposta usando `getUserMedia`/`MediaRecorder`.
6. QUANDO uma gravação é concluída, O SISTEMA DEVE permitir reproduzir o áudio gravado para autorrevisão.
7. QUANDO a tarefa é de escrita (ex.: Summarize Written Text, Write Essay, Write From Dictation, Summarize Spoken Text), O SISTEMA DEVE oferecer uma área de texto com contagem de palavras e sinalização de limite.
8. O SISTEMA NÃO DEVE exibir, calcular ou prometer qualquer "nota automática" ou pontuação estilo motor de IA da Pearson; a avaliação apresentada DEVE ser explicitamente de autorrevisão.
9. QUANDO o navegador não concede permissão de microfone ou não suporta as APIs necessárias, O SISTEMA DEVE exibir uma mensagem clara em PT-BR e permitir continuar o treino sem gravação (timers e demais recursos continuam funcionando).
10. O SISTEMA DEVE registrar que uma sessão de treino de tarefa foi concluída, para alimentar o Dashboard e o Plano de Batalha (ver Requisitos 6 e 7).

---

## Requisito 6 — Plano de Batalha (cronogramas 90 dias / 25 dias) com acompanhamento

**User story:** Como candidato, quero seguir o plano de 90 dias (1–2h/dia) e o plano Anki de 25 dias, marcando o que concluí a cada dia, para manter consistência rumo ao 79+.

#### Acceptance Criteria

1. O SISTEMA DEVE apresentar o plano de 90 dias (1–2h/dia) e o plano Anki de 25 dias conforme o material, cada um estruturado em dias/etapas com as atividades previstas.
2. QUANDO o usuário escolhe um plano, O SISTEMA DEVE registrar a data de início para derivar o "dia atual" do plano.
3. QUANDO o usuário conclui uma atividade/dia do plano, O SISTEMA DEVE permitir marcá-la como concluída e persistir esse estado (ver Requisito 7).
4. O SISTEMA DEVE exibir o progresso do plano (dias concluídos vs total, percentual) e destacar o dia atual.
5. QUANDO uma atividade do plano aponta para outra seção (ex.: um módulo de vocabulário ou uma tarefa específica), O SISTEMA DEVE oferecer um atalho para navegar até ela.

---

## Requisito 7 — Dashboard de Progresso e persistência em localStorage

**User story:** Como candidato, quero um dashboard que mostre meu progresso consolidado e que tudo fique salvo no navegador entre sessões, para acompanhar minha evolução sem precisar de login.

#### Acceptance Criteria

1. O SISTEMA DEVE persistir todo o estado de progresso exclusivamente em `localStorage`, sem backend, sem autenticação e sem envio a servidores externos.
2. QUANDO o usuário reabre o app no mesmo dispositivo/navegador, O SISTEMA DEVE restaurar: progresso de SRS do vocabulário, capítulos lidos do Guia, preenchimentos salvos de Templates, sessões de treino concluídas e progresso dos planos.
3. O Dashboard DEVE exibir um resumo consolidado, incluindo pelo menos: cartões revisados/vencidos hoje, módulos de vocabulário em andamento, tarefas de treino praticadas (contagem e última data), capítulos de estratégia lidos e progresso dos planos de batalha.
4. O SISTEMA DEVE expor uma função para exportar os dados de progresso (ex.: download de um arquivo JSON) e outra para importar/restaurar a partir desse arquivo.
5. O SISTEMA DEVE oferecer uma ação explícita para apagar/zerar o progresso, com confirmação em PT-BR.
6. QUANDO os dados em `localStorage` estiverem corrompidos, ausentes ou em versão de schema anterior, O SISTEMA DEVE degradar com segurança (reinicializar com padrões e/ou migrar) sem travar o app.
7. QUANDO `localStorage` não estiver disponível (ex.: navegação privada que bloqueia), O SISTEMA DEVE exibir um aviso em PT-BR e continuar funcionando em memória durante a sessão.

---

## Requisito 8 — Conteúdo derivado do material próprio do usuário

**User story:** Como candidato, quero que todo o conteúdo do app venha do meu próprio material, para que seja um estudo pessoal e não uma cópia de produtos pagos de terceiros.

#### Acceptance Criteria

1. O SISTEMA DEVE derivar seu conteúdo (chunks, templates, capítulos, parâmetros de tarefas, planos) dos três PDFs fornecidos pelo usuário.
2. O conteúdo DEVE ser estruturado em dados editáveis (ex.: arquivos de dados versionados) separados da lógica de apresentação, para facilitar correções sem alterar código de UI.
3. O SISTEMA NÃO DEVE incluir marcas, textos ou ativos de produtos pagos de terceiros (ex.: AlfaPTE).
4. QUANDO uma parte do conteúdo do PDF ainda não foi transcrita para os dados do app, O SISTEMA DEVE indicar claramente o item como "pendente de conteúdo" em vez de inventar informação.

---

## Fora de escopo (v1)

- Qualquer backend, API de servidor, banco de dados em nuvem ou autenticação/login.
- Qualquer pontuação automática por IA ou tentativa de reproduzir o motor de scoring da Pearson.
- Sincronização entre dispositivos.
- Reconhecimento de fala (speech-to-text) ou análise automática de pronúncia.
- Conteúdo de terceiros pagos.

## Suposições

- O usuário acessa o app por um navegador moderno de desktop/mobile com suporte a `localStorage`, `getUserMedia` e `MediaRecorder`.
- A transcrição fiel do conteúdo dos PDFs para arquivos de dados será feita na fase de implementação; esta spec define a estrutura e os requisitos, não o conteúdo integral transcrito.
- O app roda sobre HTTPS (ou `localhost`), condição necessária para acesso ao microfone.
