import type { StudyPlan, PlanDay } from './types';

// Planos de estudo — derivados da Masterclass (plano de 90 dias) e do guia de
// Anki/repetição espaçada (plano de 25 dias) do "Inglês Real".
//
// Rotas de atalho usadas em `link`:
//   /vocabulario  /estrategias  /templates  /treino  /plano  /

// ---- Plano de 90 dias (3 fases, rotina diária de 1-2h) ----
function buildNinetyDay(): PlanDay[] {
  const days: PlanDay[] = [];
  for (let d = 1; d <= 90; d++) {
    let phaseTitle = '';
    const activities = [];
    if (d <= 30) {
      // Fase 1: Fundamentos (dias 1-30)
      phaseTitle = 'Fase 1 — Fundamentos';
      activities.push(
        { id: `d${d}-strategy`, label: 'Ler/revisar 1 capítulo do Guia de Estratégias', link: '/estrategias' },
        { id: `d${d}-vocab`, label: 'Revisão SRS do dia + 1 módulo novo de vocabulário', link: '/vocabulario' },
        { id: `d${d}-gold`, label: 'Treinar 1 tarefa OURO (Read Aloud / Repeat Sentence / WFD)', link: '/treino' },
      );
    } else if (d <= 60) {
      // Fase 2: Templates e consolidação (dias 31-60)
      phaseTitle = 'Fase 2 — Templates e consolidação';
      activities.push(
        { id: `d${d}-vocab`, label: 'Revisão SRS do dia', link: '/vocabulario' },
        { id: `d${d}-template`, label: 'Praticar 1 template universal (preencher + cronometrar)', link: '/templates' },
        { id: `d${d}-task`, label: 'Treinar 2 tarefas (1 OURO + 1 neutra com template)', link: '/treino' },
      );
    } else {
      // Fase 3: Simulado e refino (dias 61-90)
      phaseTitle = 'Fase 3 — Simulado e refino';
      activities.push(
        { id: `d${d}-vocab`, label: 'Revisão SRS do dia (fila completa)', link: '/vocabulario' },
        { id: `d${d}-mock`, label: 'Mini-simulado: 3-4 tarefas cronometradas com gravação', link: '/treino' },
        { id: `d${d}-review`, label: 'Autorrevisão das gravações + ajuste de fonética', link: '/estrategias' },
      );
    }
    days.push({ day: d, title: phaseTitle, activities });
  }
  return days;
}

// ---- Plano Anki de 25 dias (4 blocos mapeando módulos a dias) ----
function buildAnki25(): PlanDay[] {
  const days: PlanDay[] = [];
  // 50 módulos distribuídos em 25 dias de estudo (2 módulos/dia) + revisão SRS diária.
  for (let d = 1; d <= 25; d++) {
    const modA = d * 2 - 1;
    const modB = d * 2;
    let block = '';
    if (d <= 7) block = 'Bloco 1 — Módulos 01-14 (temas acadêmicos base)';
    else if (d <= 14) block = 'Bloco 2 — Módulos 15-28 (sociedade e economia)';
    else if (d <= 20) block = 'Bloco 3 — Módulos 29-40 (meio ambiente e saúde)';
    else block = 'Bloco 4 — Módulos 41-50 (chunks de tarefas específicas)';

    days.push({
      day: d,
      title: block,
      activities: [
        { id: `anki-d${d}-review`, label: 'Fazer a "Revisão de hoje" (fila SRS vencida)', link: '/vocabulario' },
        {
          id: `anki-d${d}-mod`,
          label: `Adicionar módulos ${String(modA).padStart(2, '0')} e ${String(modB).padStart(2, '0')} ao estudo`,
          link: '/vocabulario',
        },
      ],
    });
  }
  return days;
}

export const STUDY_PLANS: StudyPlan[] = [
  {
    id: '90-day',
    title: 'Plano de 90 dias (1-2h/dia)',
    description:
      'Rotina diária em 3 fases: Fundamentos (1-30), Templates e consolidação (31-60), Simulado e refino (61-90). Marque cada atividade concluída para acompanhar o progresso.',
    days: buildNinetyDay(),
  },
  {
    id: 'anki-25',
    title: 'Plano Anki de 25 dias',
    description:
      'Plano intensivo de vocabulário em 4 blocos, mapeando os 50 módulos a 25 dias (2 módulos/dia) com revisão SRS diária.',
    days: buildAnki25(),
  },
];
