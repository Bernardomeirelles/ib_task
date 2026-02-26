import { StaffingCard, TimerState, KanbanState } from '../types';

const KANBAN_STORAGE_KEY = 'ib_kanban_state';
const TIMER_STATE_KEY = 'ib_timer_state';

export const kanbanService = {
  // Load all state from localStorage
  loadState: (): KanbanState => {
    const stored = localStorage.getItem(KANBAN_STORAGE_KEY);
    const defaultState: KanbanState = {
      cards: {},
      columnOrder: ['incoming', 'in-progress', 'waiting', 'completed'],
      timerState: {
        activeCardId: null,
        lastUpdateTime: Date.now(),
      },
    };

    if (!stored) return defaultState;

    try {
      return JSON.parse(stored);
    } catch {
      return defaultState;
    }
  },

  // Save all state to localStorage
  saveState: (state: KanbanState): void => {
    localStorage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(state));
  },

  // Create a new staffing card
  createCard: (codename: string, staffingTime: string): StaffingCard => {
    const now = new Date().toISOString();
    return {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      codename,
      staffingTime,
      columnType: 'incoming',
      createdAt: now,
      updatedAt: now,
      notes: '',
      startTime: null,
      elapsedTime: 0,
      isActive: false,
    };
  },

  // Update card
  updateCard: (card: StaffingCard): StaffingCard => {
    return {
      ...card,
      updatedAt: new Date().toISOString(),
    };
  },

  // Move card to different column
  moveCard: (card: StaffingCard, targetColumn: ColumnType): StaffingCard => {
    const updated = { ...card, columnType: targetColumn };
    if (targetColumn === 'completed') {
      updated.completedAt = new Date().toISOString();
      updated.isActive = false;
    }
    return kanbanService.updateCard(updated);
  },

  // Get all cards by column
  getCardsByColumn: (cards: Record<string, StaffingCard>, column: ColumnType) => {
    return Object.values(cards).filter(c => c.columnType === column);
  },

  // Update timer for a card
  updateCardTimer: (card: StaffingCard, elapsedMs: number): StaffingCard => {
    return {
      ...card,
      elapsedTime: elapsedMs,
      updatedAt: new Date().toISOString(),
    };
  },

  // Calculate urgency level based on elapsed time
  getUrgencyLevel: (elapsedMs: number) => {
    const minutes = elapsedMs / 60000;
    if (minutes < 30) return 'low';
    if (minutes < 90) return 'medium';
    if (minutes < 180) return 'high';
    return 'critical';
  },

  // Format elapsed time
  formatElapsedTime: (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  // Start timer on a card
  startCardTimer: (
    cards: Record<string, StaffingCard>,
    cardId: string
  ): Record<string, StaffingCard> => {
    const updated = { ...cards };

    // Pause all other active timers
    Object.values(updated).forEach(card => {
      if (card.isActive) {
        updated[card.id] = {
          ...card,
          isActive: false,
          startTime: null,
        };
      }
    });

    // Start the selected card
    const card = updated[cardId];
    if (card) {
      updated[cardId] = {
        ...card,
        isActive: true,
        startTime: Date.now() - card.elapsedTime,
      };
    }

    return updated;
  },

  // Pause timer on a card
  pauseCardTimer: (
    cards: Record<string, StaffingCard>,
    cardId: string
  ): Record<string, StaffingCard> => {
    const updated = { ...cards };
    const card = updated[cardId];

    if (card && card.isActive) {
      updated[cardId] = {
        ...card,
        isActive: false,
        startTime: null,
      };
    }

    return updated;
  },

  // Reset timer on a card
  resetCardTimer: (cards: Record<string, StaffingCard>, cardId: string): Record<string, StaffingCard> => {
    const updated = { ...cards };
    const card = updated[cardId];

    if (card) {
      updated[cardId] = {
        ...card,
        isActive: false,
        startTime: null,
        elapsedTime: 0,
      };
    }

    return updated;
  },

  // Delete a card
  deleteCard: (cards: Record<string, StaffingCard>, cardId: string): Record<string, StaffingCard> => {
    const updated = { ...cards };
    delete updated[cardId];
    return updated;
  },
};
