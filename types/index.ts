export interface Task {
  id: string;
  codename: string;
  staffingTime: string;
  columnId: 'incoming' | 'in-progress' | 'waiting' | 'adjusting-comments' | 'completed';
  notes: string;
  createdAt: number;
  doingTime: number;
  waitingTime: number;
  fixingTime: number;
  activeTimerType: 'doing' | 'waiting' | 'fixing' | null;
  timerStartedAt: number | null;
  isActive: boolean;
}

export interface AnalyticsEntry {
  id: string;
  codename: string;
  staffingTime: string;
  notes: string;
  createdAt: number;
  completedAt: number;
  doingTime: number;
  waitingTime: number;
  fixingTime: number;
  totalTime: number;
  sla: number;
}

export interface Column {
  id: 'incoming' | 'in-progress' | 'waiting' | 'adjusting-comments' | 'completed';
  title: string;
}
