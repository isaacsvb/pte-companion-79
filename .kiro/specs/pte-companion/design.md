# Design — PTE Companion 79+

## Visão geral da arquitetura

Aplicação **SPA 100% client-side** em React. Sem servidor, sem API, sem banco de dados remoto. Todo o estado do usuário vive no navegador (`localStorage`). O conteúdo de estudo (chunks, templates, capítulos, parâmetros das 22 tarefas, planos) é embarcado como **dados estáticos versionados** no bundle, separados da lógica de UI, e derivado dos três PDFs do próprio usuário.

```
┌───────────────────────────────────────────────────────────────┐
│                        Navegador (SPA)                         │
│                                                               │
│  ┌──────────────┐   ┌───────────────────────────────────────┐ │
│  │   Roteador    │──▶│  Páginas / Pilares                    │ │
│  │  (hash/BR)    │   │  Dashboard · Estratégias · Vocabulário │ │
│  └──────────────┘   │  Templates · Treino · Plano de Batalha │ │
│                     └───────────────────────────────────────┘ │
│          │                         │                          │
│          ▼                         ▼                          │
│  ┌──────────────┐        ┌──────────────────────┐            │
│  │  Content data │        │  Camada de domínio   │            │
│  │ (estático,    │        │  SRS · Timers ·      │            │
│  │  versionado)  │        │  Templates · Audio   │            │
│  └──────────────┘        └──────────────────────┘            │
│                                   │                           │
│                                   ▼                           │
│                     ┌──────────────────────────┐             │
│                     │  Persistência (storage)  │             │
│                     │  localStorage + fallback │             │
│                     └──────────────────────────┘             │
└───────────────────────────────────────────────────────────────┘
```

## Stack tecnológico (proposto e justificado)

| Camada | Escolha | Justificativa |
|---|---|---|
| Build/dev server | **Vite** | Startup e HMR rápidos; zero config para SPA React; build estático simples de hospedar (GitHub Pages/Netlify/arquivos locais). |
| UI | **React 18** + função components + hooks | Exigência do produto; hooks cobrem todo o estado necessário sem Redux. |
| Linguagem | **TypeScript** | Tipagem dos modelos de domínio (tarefas, SRS, templates) reduz erros e documenta o conteúdo derivado dos PDFs. |
| Roteamento | **react-router-dom** (ou roteador leve por hash) | Rotas por pilar, rota persistente ao recarregar (Req 1.4). Hash routing evita necessidade de config de servidor para deep-link. |
| Estilo | **CSS Modules** ou utilitário leve (ex.: Tailwind) | Responsividade (Req 1.5); decisão final na implementação, sem impacto nos requisitos. |
| Estado global | **React Context + hooks** (sem Redux) | Escopo pequeno; um `ProgressProvider` sobre `localStorage` basta. |
| Testes | **Vitest** + **React Testing Library** | Integra com Vite; cobre lógica de domínio (SRS, timers, montagem de template, serialização de storage) e componentes. |
| Áudio | APIs nativas `getUserMedia` + `MediaRecorder` | Sem dependência externa; grava e reproduz voz (Req 5). |

> Observação: a escolha entre Tailwind e CSS Modules, e entre react-router e um roteador por hash, é um detalhe de implementação que não altera requisitos. O coder deve validar a disponibilidade de rede ao instalar; nenhuma verificação de toolchain foi feita nesta fase.

## Estrutura de diretórios proposta

```
pte-companion/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
└── src/
    ├── main.tsx                 # bootstrap React
    ├── App.tsx                  # layout + navegação + rotas
    ├── routes/                  # uma pasta/arquivo por pilar
    │   ├── Dashboard/
    │   ├── Strategy/            # Guia de Estratégias
    │   ├── Vocabulary/          # 500 Chunks + SRS
    │   ├── Templates/           # Templates Universais
    │   ├── TaskTrainer/         # Treino das 22 tarefas
    │   └── BattlePlan/          # Planos 90/25 dias
    ├── domain/
    │   ├── srs.ts               # algoritmo de repetição espaçada
    │   ├── timers.ts            # máquina de estados prep→resposta
    │   ├── templates.ts         # montagem de placeholders + contagem de palavras
    │   └── audio.ts             # wrapper getUserMedia/MediaRecorder
    ├── storage/
    │   ├── storage.ts           # leitura/escrita localStorage + fallback em memória
    │   ├── schema.ts            # versão de schema + migrações
    │   └── exportImport.ts      # exportar/importar JSON de progresso
    ├── state/
    │   └── ProgressContext.tsx  # provider do progresso do usuário
    ├── content/                 # DADOS derivados dos PDFs (separados da UI)
    │   ├── tasks.ts             # 22 tarefas (Tabela Mestra de Execução)
    │   ├── vocabulary.ts        # 50 módulos × ~10 entradas
    │   ├── templates.ts         # templates universais + placeholders
    │   ├── strategy.ts          # capítulos do Guia de Estratégias
    │   └── plans.ts             # plano 90 dias e plano Anki 25 dias
    └── components/              # UI reutilizável (Timer, Flashcard, AudioRecorder, WordCounter, ...)
```

## Modelos de domínio (TypeScript)

```ts
// content/tasks.ts
type SkillPart = 'speaking' | 'writing' | 'reading' | 'listening';

interface PteTask {
  id: string;                 // ex.: 'read-aloud'
  name: string;               // nome oficial em inglês
  part: SkillPart;
  prepSeconds: number | null; // tempo de preparação (null se não houver)
  responseSeconds: number;    // tempo de resposta
  wordLimit?: { min?: number; max?: number }; // quando aplicável (ex.: SWT, Essay)
  requiresMic: boolean;       // true para tarefas de fala
  tier: 'gold' | 'junk' | 'neutral'; // classificação da matriz 80/20
  description: string;        // instrução em PT-BR
}

// content/vocabulary.ts
interface VocabEntry {
  id: string;
  english: string;            // chunk/expressão em inglês
  practicalPronunciation: string; // "Pronúncia Prática" (dica p/ brasileiros)
  translationPtBr: string;    // tradução
}
interface VocabModule { id: string; index: number; title: string; entries: VocabEntry[]; }

// content/templates.ts
interface TemplateDef {
  id: string;
  taskName: string;           // Describe Image, Write Essay, SWT, SST, Re-tell Lecture, ...
  body: string;               // texto com placeholders demarcados
  placeholders: { key: string; label: string; hint?: string }[];
  wordLimit?: { min?: number; max?: number };
}

// content/strategy.ts
interface StrategyChapter { id: string; title: string; bodyMarkdown: string; order: number; }

// content/plans.ts
interface PlanDay { day: number; activities: { id: string; label: string; link?: string }[]; }
interface StudyPlan { id: '90-day' | 'anki-25'; title: string; days: PlanDay[]; }
```

### Estado de progresso (persistido)

```ts
interface SrsCardState {           // um por VocabEntry estudada
  entryId: string;
  ease: number;                    // fator de facilidade (SM-2 simplificado)
  intervalDays: number;
  dueDate: string;                 // ISO date
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review';
}

interface ProgressState {
  schemaVersion: number;
  srs: Record<string, SrsCardState>;
  strategyRead: Record<string, boolean>;          // chapterId -> lido
  templateFills: Record<string, Record<string,string>>; // templateId -> {key: valor}
  taskSessions: { taskId: string; completedAt: string }[];
  plans: Record<string, { startedAt: string | null; doneActivities: Record<string, boolean> }>;
}
```

## Decisões de design por pilar

### 1. Navegação (Req 1)
Layout com barra/menu lateral ou superior sempre visível. Roteamento por hash para que o reload mantenha a rota sem configuração de servidor. Todos os rótulos em PT-BR centralizados em um módulo de strings de UI para consistência.

### 2. Guia de Estratégias (Req 2)
Capítulos como dados (`strategy.ts`, markdown por capítulo) renderizados por um visualizador de markdown. A matriz 80/20 lê o campo `tier` das 22 tarefas e as agrupa visualmente (ouro / lixo / neutro). Fonética (8 vícios) e tabela US-vs-UK são capítulos com tabelas. "Marcar como lido" grava em `strategyRead`.

### 3. Vocabulário / SRS (Req 3)
- **Algoritmo:** SM-2 simplificado estilo Anki. Avaliação do usuário em 3–4 níveis (ex.: "De novo", "Difícil", "Bom", "Fácil"). O algoritmo atualiza `ease`, `intervalDays`, `dueDate` e `state`. Documentar as fórmulas em `srs.ts` com testes unitários determinísticos (datas injetáveis via função `now()`).
- **Fila de estudo:** cartões `due` (dueDate <= hoje) + novos limitados por sessão; estudo por módulo ou fila mista.
- **Flashcard UI:** frente (inglês) → revela verso (Pronúncia Prática + tradução); botões de avaliação disparam o reagendamento.
- Contadores novo/aprendendo/dominado por módulo e no total.

### 4. Templates Universais (Req 4)
Editor de dois painéis: formulário de placeholders à esquerda, pré-visualização montada à direita, atualizada em tempo real. Contagem de palavras com faixa (verde dentro, vermelho fora) usando os limites definidos (ex.: SWT 5–75, Essay 200–300 — confirmar números na Tabela Mestra/PR Master Guide ao transcrever). Botão "Copiar" (Clipboard API) e persistência dos preenchimentos em `templateFills`.

### 5. Treino de Tarefas (Req 5)
- **Fonte de verdade:** `tasks.ts` reproduz a **Tabela Mestra de Execução** (tempos de prep/resposta e limites). Os valores exatos de cada uma das 22 tarefas devem ser transcritos do PDF na implementação; a estrutura já está definida.
- **Máquina de estados do timer** (`timers.ts`): `idle → prep (regressivo) → response (regressivo/decorrido) → done`. Transição automática ao fim da preparação. Testável com relógio injetável.
- **Gravação de voz** (`audio.ts`): solicita microfone no início da fase de resposta das tarefas com `requiresMic`; grava com `MediaRecorder`; gera `Blob`/`objectURL` para reprodução imediata. Sem upload. As gravações são efêmeras na sessão (não persistidas em `localStorage` por limite de tamanho); documentar essa decisão na UI.
- **Tarefas de escrita:** textarea com `WordCounter` e sinalização de limite.
- **Sem scoring:** a UI mostra apenas o próprio áudio/texto para autorrevisão, com aviso explícito de que não há nota automática (Req 5.8).
- **Degradação:** sem permissão/sem suporte a MediaRecorder → aviso em PT-BR e treino segue sem gravação (Req 5.9).
- Ao concluir, registra `taskSessions` para Dashboard/Plano.

### 6. Plano de Batalha (Req 6)
Planos como dados (`plans.ts`). Ao escolher um plano, grava `startedAt`; "dia atual" = diferença de datas. Cada atividade marcável (`doneActivities`). Barra de progresso (dias concluídos / total). Atividades com `link` oferecem atalho de navegação para a seção correspondente.

### 7. Dashboard + Persistência (Req 7)
- **storage.ts:** `load()/save()` em uma chave única `pte-companion:v{N}`; `try/catch` para `localStorage` indisponível → fallback em memória + aviso.
- **schema.ts:** `schemaVersion` + migrações idempotentes; dados corrompidos → reinicializa com padrões sem travar.
- **exportImport.ts:** exporta `ProgressState` como JSON para download; importa/valida e substitui.
- **ProgressContext:** provê estado e ações; grava em `localStorage` em cada mutação (debounce opcional).
- **Dashboard:** deriva o resumo (cartões hoje, módulos em andamento, tarefas praticadas + última data, capítulos lidos, progresso dos planos) do `ProgressState`. Ação de "zerar progresso" com confirmação.

## Fluxos principais

**Sessão de flashcards:** abrir Vocabulário → escolher módulo ou "revisão de hoje" → ver frente → revelar verso → avaliar → SRS reagenda e persiste → próximo cartão → fim → Dashboard atualiza.

**Treino de tarefa de fala:** abrir Treino → escolher tarefa → (permissão de mic) → timer de preparação → auto-transição → timer de resposta + gravação → parar → reproduzir para autorrevisão → marcar concluída → persiste `taskSessions`.

## Conteúdo derivado dos PDFs (Req 8)

Todo o conteúdo fica em `src/content/*` como dados tipados, separados da UI. Itens ainda não transcritos do PDF são marcados como "pendente de conteúdo" na UI, nunca inventados. Nenhuma marca ou ativo de terceiros pagos (ex.: AlfaPTE) é incluído.

## Testabilidade e verificação

- **Lógica pura testável** (`srs.ts`, `timers.ts`, `templates.ts`, `storage/schema.ts`) com relógio/data injetáveis, cobertos por Vitest.
- **Componentes** (Flashcard, Timer, WordCounter, AudioRecorder com `MediaRecorder` mockado) cobertos por React Testing Library.
- **Comandos (a confirmar no scaffold):** `npm install`, `npm run dev`, `npm run build`, `npm run test`.
- Microfone exige HTTPS/localhost; os testes de áudio usam mocks das APIs.

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Valores exatos das 22 tarefas e limites de palavras precisam vir dos PDFs | Estrutura de dados pronta; transcrição fiel na implementação; itens não transcritos marcados como pendentes. |
| Suporte a `MediaRecorder` varia entre navegadores | Detecção de suporte + fallback sem gravação (Req 5.9). |
| `localStorage` indisponível (navegação privada) | Fallback em memória + aviso (Req 7.7). |
| Limite de tamanho de `localStorage` | Áudio não é persistido; apenas progresso leve (JSON) é salvo. |
| Corrupção/mudança de schema | `schemaVersion` + migrações + reset seguro (Req 7.6). |

## Conformidade com restrições

- Sem backend, sem login, só `localStorage` ✅
- Speaking: gravar/reproduzir + timers reais, **sem** nota automática ✅
- UI PT-BR, conteúdo EN+apoio PT-BR ✅
- Conteúdo apenas do material próprio, sem terceiros pagos ✅
