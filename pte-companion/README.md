# PTE Companion 79+

Ferramenta pessoal, **100% client-side** (sem backend, sem login, sem nuvem), para ajudar um candidato brasileiro a atingir **PTE Academic 79+**. Todo o progresso é salvo apenas no `localStorage` do navegador.

> A interface é em **Português (Brasil)**; o conteúdo de estudo é em **inglês** com apoio em PT-BR (Pronúncia Prática, traduções, explicações). O app **não** calcula nota automática nem reproduz o motor de pontuação da Pearson — a avaliação é de **autorrevisão**.

## Stack

- Vite + React 18 + TypeScript
- React Context + hooks (estado global)
- `react-router-dom` (HashRouter — rota persistente ao recarregar, sem config de servidor)
- Vitest + React Testing Library (testes)
- APIs nativas `getUserMedia` / `MediaRecorder` (gravação de voz)

## Comandos

```bash
npm install     # instala dependências
npm run dev      # servidor de desenvolvimento
npm run build    # type-check + build de produção (gera dist/)
npm run test     # roda a suíte de testes (Vitest)
npm run lint     # ESLint
```

> O microfone exige HTTPS ou `localhost`. Sem permissão/suporte, o treino segue sem gravação.

## Pilares

1. **Dashboard** — resumo consolidado + exportar/importar/zerar progresso.
2. **Guia de Estratégias** — capítulos (algoritmo, chunking, matriz 80/20, fonética, US×UK, conectores, lista negra de gramática, FAQs, protocolo de mic) com "marcar como lido".
3. **Vocabulário (500 Chunks)** — 50 módulos com flashcards SRS (SM-2 simplificado).
4. **Templates Universais** — editor de 2 painéis com preenchimento de placeholders, contagem de palavras e cópia.
5. **Treino de Tarefas** — 22 tarefas oficiais com timers reais (prep → resposta), textarea com contador para tarefas de escrita e gravação/reprodução de voz nas tarefas de fala.
6. **Plano de Batalha** — planos de 90 dias e Anki de 25 dias com acompanhamento diário.

## Estrutura

```
src/
  content/     # dados derivados dos PDFs (tasks, vocabulary, templates, strategy, plans)
  domain/      # lógica pura testável (srs, timers, templates, audio, plans)
  storage/     # localStorage + schema/migração + export/import
  state/       # ProgressContext
  routes/      # um pilar por pasta
  components/  # Timer, WordCounter, AudioRecorder, Markdown
  ui/          # strings de UI centralizadas (PT-BR)
```

## Fonte de verdade do conteúdo

- As 22 tarefas (tempos de preparação/resposta e limites de palavras) seguem a **Tabela Mestra de Execução (Apêndice E)** do PDF "PTE Academic 2026 Definitive 79+ Masterclass". Onde os limites divergem entre PDFs, prevalece o Apêndice E.
- Todo o conteúdo vem exclusivamente do material do próprio usuário. Nenhuma marca de terceiros pagos é incluída.

## Pendente de conteúdo

Itens ainda não transcritos legivelmente dos PDFs são marcados na UI como **"pendente de conteúdo"** (nunca inventados). Atualmente:

- **Vocabulário:** os títulos dos 50 módulos estão transcritos; as entradas (inglês + Pronúncia Prática + tradução) estão semeadas nos módulos 01 e 50 como amostra. Os demais módulos aparecem como "pendente de conteúdo" até a transcrição completa das entradas dos PDFs.
