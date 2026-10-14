# Plano de Implementação — PTE Companion 79+

> Cada item é um passo de codificação incremental, test-first onde fizer sentido, que deixa o app em estado funcional. Os números entre parênteses referenciam os requisitos de `requirements.md`.

- [ ] 1. Scaffold do projeto e baseline verde
  - Criar o app com Vite + React + TypeScript na raiz `pte-companion/` (ou na raiz do workspace, conforme definido no scaffold).
  - Configurar react-router (ou roteador por hash), estrutura de pastas de `design.md` (`routes/`, `domain/`, `storage/`, `state/`, `content/`, `components/`), ESLint e Vitest + React Testing Library.
  - Adicionar scripts `dev`, `build`, `test` e um teste "smoke" que renderiza `App`.
  - _Objetivo:_ `npm install`, `npm run build` e `npm run test` passam com baseline mínimo.
  - _Requisitos:_ base para todos.

- [ ] 2. Camada de persistência (localStorage + schema + export/import)
  - Implementar `storage/storage.ts` (`load`/`save` em chave única, `try/catch`, fallback em memória + aviso quando indisponível).
  - Implementar `storage/schema.ts` com `schemaVersion`, defaults e migração idempotente; reset seguro em dados corrompidos.
  - Implementar `storage/exportImport.ts` (exportar JSON para download, importar com validação).
  - Criar `state/ProgressContext.tsx` provendo `ProgressState` e ações, gravando a cada mutação.
  - Escrever testes unitários: round-trip save/load, fallback sem localStorage, corrupção → reset, migração de versão, export/import.
  - _Requisitos:_ 7.1, 7.2, 7.4, 7.6, 7.7.

- [ ] 3. Navegação, layout e strings de UI em PT-BR
  - Implementar `App.tsx` com navegação persistente (Dashboard, Estratégias, Vocabulário, Templates, Treino, Plano de Batalha), rotas e rota persistente ao recarregar.
  - Centralizar rótulos de UI em PT-BR; garantir layout responsivo (desktop/mobile).
  - Testes: rotas renderizam a seção certa; reload preserva rota (hash).
  - _Requisitos:_ 1.1, 1.2, 1.3, 1.4, 1.5.

- [ ] 4. Modelos de conteúdo e dados derivados dos PDFs
  - Definir os tipos de `content/*` (PteTask, VocabEntry/Module, TemplateDef, StrategyChapter, StudyPlan) conforme `design.md`.
  - Transcrever a **Tabela Mestra de Execução** para `content/tasks.ts` cobrindo as 22 tarefas (part, prepSeconds, responseSeconds, wordLimit, requiresMic, tier da matriz 80/20). Itens sem dado confirmado ficam marcados como "pendente de conteúdo".
  - Semear `content/vocabulary.ts` com a estrutura dos 50 módulos (inglês + Pronúncia Prática + tradução); `content/templates.ts`, `content/strategy.ts`, `content/plans.ts` com estrutura + conteúdo transcrito disponível.
  - Garantir separação dados × UI e ausência de ativos de terceiros pagos.
  - Testes: validação de integridade dos dados (ex.: 22 tarefas presentes, módulos com entradas bem formadas).
  - _Requisitos:_ 8.1, 8.2, 8.3, 8.4; base para 2/3/4/5/6 (conteúdo).

- [ ] 5. Guia de Estratégias
  - Implementar índice + visualizador de capítulos (markdown) a partir de `content/strategy.ts`.
  - Matriz 80/20 derivada do `tier` das tarefas (ouro/lixo/neutro); capítulo de fonética (8 vícios) e tabela US-vs-UK; conectores e lista negra de gramática; FAQs.
  - "Marcar como lido" persistindo em `strategyRead`.
  - Testes: renderização de capítulo; marcar lido persiste; matriz agrupa por tier.
  - _Requisitos:_ 2.1–2.6.

- [ ] 6. Vocabulário / 500 Chunks com SRS
  - Implementar `domain/srs.ts` (SM-2 simplificado, relógio injetável) com testes determinísticos de reagendamento.
  - UI de módulos + sessão de flashcards (frente→verso, avaliação) + fila "revisão de hoje" (due) e estudo por módulo.
  - Contadores novo/aprendendo/dominado por módulo e total; persistir `srs`.
  - Testes: due selection, atualização de ease/intervalo, contadores.
  - _Requisitos:_ 3.1–3.8.

- [ ] 7. Templates Universais preenchíveis
  - Implementar `domain/templates.ts` (montagem de placeholders + contagem de palavras) com testes.
  - Editor dois painéis (form + preview em tempo real), sinalização de faixa de palavras, botão copiar (Clipboard), persistência em `templateFills`.
  - Cobrir no mínimo: Describe Image, Write Essay, SWT, SST, Re-tell Lecture, Respond to a Situation, Summarize Group Discussion.
  - Testes: montagem substitui placeholders; contagem/sinalização de limite; persistência dos preenchimentos.
  - _Requisitos:_ 4.1–4.6.

- [ ] 8. Treino de Tarefas: timers e tarefas de escrita
  - Implementar `domain/timers.ts` (máquina `idle→prep→response→done`, relógio injetável, auto-transição) com testes.
  - UI de lista das 22 tarefas agrupadas por parte; execução com timers reais vindos de `content/tasks.ts`.
  - Tarefas de escrita: textarea com `WordCounter` e sinalização de limite.
  - Registrar `taskSessions` ao concluir. Exibir aviso explícito de autorrevisão (sem nota automática).
  - Testes: transição prep→response; contagem de palavras; registro de sessão.
  - _Requisitos:_ 5.1, 5.2, 5.3, 5.4, 5.7, 5.8, 5.10.

- [ ] 9. Treino de Tarefas: gravação e reprodução de voz
  - Implementar `domain/audio.ts` (wrapper `getUserMedia`/`MediaRecorder`, detecção de suporte, `objectURL` para playback efêmero).
  - Componente `AudioRecorder`: solicita microfone na fase de resposta das tarefas `requiresMic`, grava e permite reproduzir para autorrevisão.
  - Degradação: sem permissão/sem suporte → mensagem PT-BR e treino segue sem gravação.
  - Testes: `MediaRecorder`/`getUserMedia` mockados — fluxo gravar→reproduzir e caminho de falha/sem suporte.
  - _Requisitos:_ 5.5, 5.6, 5.9.

- [ ] 10. Plano de Batalha (90 dias / 25 dias Anki) com acompanhamento
  - Renderizar os planos de `content/plans.ts` em dias/etapas; registrar `startedAt` ao iniciar; derivar "dia atual".
  - Marcar atividades/dias como concluídos (persistir `plans`); barra de progresso (concluídos/total, %); destacar dia atual; atalhos de navegação para seções referenciadas.
  - Testes: cálculo de dia atual; marcar atividade persiste; percentual de progresso.
  - _Requisitos:_ 6.1–6.5.

- [ ] 11. Dashboard de Progresso
  - Implementar o Dashboard consolidando: cartões revisados/vencidos hoje, módulos em andamento, tarefas praticadas (contagem + última data), capítulos lidos, progresso dos planos.
  - Ações de exportar/importar progresso (JSON) e "zerar progresso" com confirmação em PT-BR.
  - Testes: derivação do resumo a partir de `ProgressState`; confirmação de reset; export/import ligado à UI.
  - _Requisitos:_ 7.3, 7.4, 7.5.

- [ ] 12. Passagem final de verificação e polimento
  - Rodar `npm run build` e `npm run test`; corrigir falhas.
  - Revisar conformidade: UI em PT-BR, sem backend/login, só localStorage, sem nota automática, conteúdo apenas do material próprio, itens não transcritos marcados como pendentes.
  - Verificar responsividade e os caminhos de degradação (sem mic, sem localStorage).
  - _Requisitos:_ 1.5, 5.8, 5.9, 7.7, 8.3, 8.4.
```
