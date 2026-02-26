export type ColumnType = 'incoming' | 'in-progress' | 'waiting' | 'completed';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface StaffingCard {
  id: string;
  codename: string;
  staffingTime: string; // HH:MM format
  columnType: ColumnType;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  startTime: number | null; // timestamp when timer started
  elapsedTime: number; // milliseconds
  isActive: boolean; // whether timer is currently running
  completedAt?: string;
}

export interface TimerState {
  activeCardId: string | null;
  lastUpdateTime: number;
}

export interface KanbanState {
  cards: Record<string, StaffingCard>;
  columnOrder: ColumnType[];
  timerState: TimerState;
}
