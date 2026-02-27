export const translations = {
  pt: {
    // TopBar
    activeTask: 'Ativa:',
    noActiveTask: 'Sem Tarefa Ativa',
    total: 'Total:',
    activeTasks: 'Ativas:',
    newTask: 'nova',
    timer: 'timer',

    // CreateTaskModal
    newTaskTitle: 'Nova Tarefa',
    willBeAddedTo: 'Será adicionada a:',
    taskCodename: 'Codename da Tarefa',
    staffingTimeEstimate: 'Estimativa de Tempo',
    staffingTimePlaceholder: 'ex: 2h, 30m',
    cancel: 'Cancelar',
    create: 'Criar',

    // KanbanColumn
    noTasks: 'Sem tarefas',

    // TaskCard
    incoming: 'Entrada',
    inProgress: 'Em Progresso',
    waiting: 'Aguardando',
    adjusting: 'Ajustando',
    completed: 'Concluída',
    completedTask: 'Tarefa concluída',
    startTimer: 'Iniciar timer',
    pauseTimer: 'Pausar timer',
    addNotes: 'Adicionar notas',
    editNotes: 'Editar notas',
    quickNotes: 'Notas rápidas...',
    save: 'Salvar',
    sendToAnalytics: 'Enviar para analytics',
    deleteTask: 'Deletar tarefa',
    staffingTime: 'Tempo de Staffing:',

    // AnalyticsView
    analytics: 'Analytics',
    archivedCompletedTasks: 'Somente tarefas concluídas arquivadas',
    totalArchived: 'Total Arquivado',
    totalTime: 'Tempo Total',
    averageTime: 'Tempo Médio',
    longestTask: 'Maior Tarefa',
    workTimeByDay: 'Tempo de Trabalho por Dia da Semana',
    workDoingFixing: 'Trabalho (Fazendo + Corrigindo)',
    waiting: 'Aguardando',
    archivedTasks: 'Tarefas Arquivadas',
    codename: 'Codename',
    staffing: 'Staffing',
    work: 'Trabalho',
    wait: 'Aguard',
    done: 'Concluído',
    noTasksArchived: 'Nenhuma tarefa arquivada ainda.',
    projectBreakdown: 'Composição do Projeto',
    doingPercentage: 'Fazendo',
    fixingPercentage: 'Corrigindo',
    waitingPercentage: 'Aguardando',

    // Board / Analytics tabs
    board: 'Board',
    analytics: 'Analytics',
  },
  en: {
    // TopBar
    activeTask: 'Active:',
    noActiveTask: 'No Active Task',
    total: 'Total:',
    activeTasks: 'Active:',
    newTask: 'new',
    timer: 'timer',

    // CreateTaskModal
    newTaskTitle: 'New Task',
    willBeAddedTo: 'Will be added to:',
    taskCodename: 'Task Codename',
    staffingTimeEstimate: 'Staffing Time Estimate',
    staffingTimePlaceholder: 'e.g., 2h, 30m',
    cancel: 'Cancel',
    create: 'Create',

    // KanbanColumn
    noTasks: 'No tasks',

    // TaskCard
    incoming: 'Incoming',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    adjusting: 'Adjusting',
    completed: 'Completed',
    completedTask: 'Completed task',
    startTimer: 'Start timer',
    pauseTimer: 'Pause timer',
    addNotes: 'Add notes',
    editNotes: 'Edit notes',
    quickNotes: 'Quick notes...',
    save: 'Save',
    sendToAnalytics: 'Send to analytics',
    deleteTask: 'Delete task',
    staffingTime: 'Staffing Time:',

    // AnalyticsView
    analytics: 'Analytics',
    archivedCompletedTasks: 'Archived completed tasks only',
    totalArchived: 'Total Archived',
    totalTime: 'Total Time',
    averageTime: 'Average Time',
    longestTask: 'Longest Task',
    workTimeByDay: 'Work Time by Day of Week',
    workDoingFixing: 'Work (Doing + Fixing)',
    waiting: 'Waiting',
    archivedTasks: 'Archived Tasks',
    codename: 'Codename',
    staffing: 'Staffing',
    work: 'Work',
    wait: 'Wait',
    done: 'Done',
    noTasksArchived: 'No tasks archived yet.',
    projectBreakdown: 'Project Breakdown',
    doingPercentage: 'Doing',
    fixingPercentage: 'Fixing',
    waitingPercentage: 'Waiting',

    // Board / Analytics tabs
    board: 'Board',
    analytics: 'Analytics',
  },
};

export type Language = 'pt' | 'en';
export type TranslationKey = keyof typeof translations.pt;

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations.en[key] || key;
};
