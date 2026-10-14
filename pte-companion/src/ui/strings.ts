// Strings de interface centralizadas — Português (Brasil).
// Mantém a UI consistente e em um único lugar (Req 1.2).

export const UI = {
  appName: 'PTE Companion 79+',
  appTagline: 'Sua ferramenta pessoal rumo ao PTE Academic 79+',

  nav: {
    dashboard: 'Dashboard',
    strategy: 'Guia de Estratégias',
    vocabulary: 'Vocabulário (500 Chunks)',
    templates: 'Templates Universais',
    taskTrainer: 'Treino de Tarefas',
    battlePlan: 'Plano de Batalha',
  },

  common: {
    pending: 'pendente de conteúdo',
    markAsRead: 'Marcar como lido',
    markedAsRead: 'Lido',
    back: 'Voltar',
    start: 'Iniciar',
    stop: 'Parar',
    reset: 'Reiniciar',
    save: 'Salvar',
    copy: 'Copiar',
    copied: 'Copiado!',
    close: 'Fechar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    next: 'Próximo',
    total: 'Total',
    day: 'Dia',
    words: 'palavras',
    seconds: 'segundos',
    none: 'Nenhum',
  },

  storage: {
    unavailableWarning:
      'Atenção: o armazenamento local do navegador não está disponível (ex.: navegação privada). Seu progresso será mantido apenas durante esta sessão e NÃO será salvo ao fechar a aba.',
  },

  dashboard: {
    title: 'Dashboard de Progresso',
    cardsDueToday: 'Cartões para revisar hoje',
    cardsReviewedToday: 'Cartões revisados hoje',
    modulesInProgress: 'Módulos em andamento',
    tasksPracticed: 'Tarefas praticadas',
    lastPractice: 'Última prática',
    chaptersRead: 'Capítulos lidos',
    plansProgress: 'Progresso dos planos',
    exportData: 'Exportar progresso (JSON)',
    importData: 'Importar progresso (JSON)',
    resetData: 'Zerar todo o progresso',
    resetConfirm:
      'Tem certeza que deseja apagar TODO o seu progresso? Esta ação não pode ser desfeita.',
    importSuccess: 'Progresso importado com sucesso!',
    importError: 'Arquivo inválido. Não foi possível importar o progresso.',
    noActivityYet: 'Ainda não há atividade registrada. Comece por qualquer pilar!',
  },

  gamification: {
    level: 'Nível',
    xp: 'XP',
    xpToNext: 'XP para o próximo nível',
    streak: 'Ofensiva',
    streakDays: 'dias consecutivos',
    streakBest: 'Melhor ofensiva',
    streakKeepGoing: 'Estude hoje para manter sua ofensiva!',
    achievements: 'Conquistas',
    achievementsUnlocked: 'desbloqueadas',
    locked: 'Bloqueada',
    unlocked: 'Desbloqueada',
    newAchievement: 'Nova conquista desbloqueada!',
    goalsTitle: 'Metas rumo ao 79+',
    goalVocab: 'Módulos de vocabulário dominados',
    goalChapters: 'Capítulos de estratégia lidos',
    goalTasks: 'Tipos de tarefa praticados',
    goalPlans: 'Progresso médio dos planos',
    cardsReviewedTotal: 'Revisões de cartões (total)',
    masteredCards: 'Cartões dominados',
    goalHint:
      'Avance de forma constante em todos os pilares: vocabulário, estratégia, treino e plano. Consistência diária é o caminho para o 79+.',
  },

  srs: {
    again: 'De novo',
    hard: 'Difícil',
    good: 'Bom',
    easy: 'Fácil',
    reveal: 'Revelar resposta',
    newCards: 'Novos',
    learning: 'Em aprendizado',
    mastered: 'Dominados',
    studyModule: 'Estudar módulo',
    studyDue: 'Revisão de hoje',
    noDueCards: 'Nenhum cartão vencido para hoje. Bom trabalho!',
    sessionDone: 'Sessão concluída!',
    pronunciation: 'Pronúncia Prática',
    translation: 'Tradução',
  },

  trainer: {
    prepPhase: 'Preparação',
    responsePhase: 'Resposta',
    done: 'Concluído',
    prepTime: 'Tempo de preparação',
    responseTime: 'Tempo de resposta',
    wordLimit: 'Limite de palavras',
    noAutoScore:
      'Aviso: este app NÃO calcula nenhuma nota automática nem reproduz o motor de pontuação da Pearson. A avaliação é de autorrevisão: ouça/leia sua própria resposta e compare com os templates e critérios do seu material.',
    micDenied:
      'Permissão de microfone negada ou não suportada por este navegador. Você pode continuar o treino sem gravação; os timers e demais recursos seguem funcionando.',
    recording: 'Gravando…',
    playRecording: 'Reproduzir gravação',
    recordingEphemeral:
      'As gravações ficam apenas nesta sessão (não são salvas no navegador) para preservar espaço.',
    completeSession: 'Marcar tarefa como concluída',
    sessionRegistered: 'Sessão registrada!',
    startPrep: 'Iniciar preparação',
    startResponse: 'Iniciar resposta',
  },

  templates: {
    fillPlaceholders: 'Preencha os campos',
    preview: 'Pré-visualização',
    withinRange: 'Dentro da faixa',
    outOfRange: 'Fora da faixa',
    saved: 'Preenchimentos salvos!',
  },

  battlePlan: {
    start: 'Iniciar este plano',
    started: 'Plano iniciado em',
    currentDay: 'Dia atual',
    goToSection: 'Ir para a seção',
    progress: 'Progresso',
    notStarted: 'Plano ainda não iniciado',
  },

  strategy: {
    matrixGold: 'Tarefas OURO (alto impacto)',
    matrixJunk: 'Tarefas LIXO (baixo retorno)',
    matrixNeutral: 'Tarefas neutras (base de templates)',
  },
} as const;
