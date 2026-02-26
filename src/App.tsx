import React, { useState, useEffect, useCallback } from 'react';
import { StaffingCard, ColumnType, KanbanState, UrgencyLevel } from '../types';
import { kanbanService } from '../services/kanbanService';
import { KanbanColumn } from '../components/KanbanColumn';
import { NewCardForm } from '../components/NewCardForm';

export const App: React.FC = () => {
  const [state, setState] = useState<KanbanState>(() => kanbanService.loadState());
  const [showForm, setShowForm] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [formattedTimes, setFormattedTimes] = useState<Record<string, string>>({});
  const [urgencyLevels, setUrgencyLevels] = useState<Record<string, UrgencyLevel>>({});

  // Update timer display every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newFormattedTimes: Record<string, string> = {};
      const newUrgencyLevels: Record<string, UrgencyLevel> = {};
      let stateChanged = false;

      Object.entries(state.cards).forEach(([cardId, card]) => {
        let elapsedTime = card.elapsedTime;

        if (card.isActive && card.startTime) {
          elapsedTime = Date.now() - card.startTime;
        }

        newFormattedTimes[cardId] = kanbanService.formatElapsedTime(elapsedTime);
        newUrgencyLevels[cardId] = kanbanService.getUrgencyLevel(elapsedTime);

        // Update card's elapsed time if active
        if (card.isActive && card.startTime) {
          const updatedCard = kanbanService.updateCardTimer(card, elapsedTime);
          if (updatedCard.elapsedTime !== card.elapsedTime) {
            stateChanged = true;
            state.cards[cardId] = updatedCard;
          }
        }
      });

      setFormattedTimes(newFormattedTimes);
      setUrgencyLevels(newUrgencyLevels);

      if (stateChanged) {
        kanbanService.saveState(state);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state]);

  // Save state whenever it changes
  useEffect(() => {
    kanbanService.saveState(state);
  }, [state]);

  const handleCreateCard = (codename: string, staffingTime: string) => {
    const newCard = kanbanService.createCard(codename, staffingTime);
    const newState = { ...state };
    newState.cards[newCard.id] = newCard;
    setState(newState);
    setShowForm(false);
  };

  const handleStartTimer = useCallback((cardId: string) => {
    const newCards = kanbanService.startCardTimer(state.cards, cardId);
    const newState = { ...state, cards: newCards };
    setState(newState);
  }, [state]);

  const handlePauseTimer = useCallback((cardId: string) => {
    const newCards = kanbanService.pauseCardTimer(state.cards, cardId);
    const newState = { ...state, cards: newCards };
    setState(newState);
  }, [state]);

  const handleResetTimer = useCallback((cardId: string) => {
    const newCards = kanbanService.resetCardTimer(state.cards, cardId);
    const newState = { ...state, cards: newCards };
    setState(newState);
  }, [state]);

  const handleUpdateNotes = useCallback((cardId: string, notes: string) => {
    const card = state.cards[cardId];
    if (card) {
      const newState = { ...state };
      newState.cards[cardId] = kanbanService.updateCard({
        ...card,
        notes,
      });
      setState(newState);
    }
  }, [state]);

  const handleDeleteCard = useCallback((cardId: string) => {
    const newCards = kanbanService.deleteCard(state.cards, cardId);
    const newState = { ...state, cards: newCards };
    setState(newState);
  }, [state]);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumn: ColumnType) => {
    e.preventDefault();
    if (!draggedCardId) return;

    const card = state.cards[draggedCardId];
    if (card) {
      const movedCard = kanbanService.moveCard(card, targetColumn);
      const newState = { ...state };
      newState.cards[draggedCardId] = movedCard;
      setState(newState);
    }

    setDraggedCardId(null);
  };

  // Count active tasks for status bar
  const activeTasksCount = Object.values(state.cards).filter(c => c.isActive).length;
  const completedCount = Object.values(state.cards).filter(c => c.columnType === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-950 border-b border-gray-700 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-widest">
                🏛️ IB STAFFING BOARD
              </h1>
              <p className="text-gray-400 text-xs mt-1">Investment Banking Workflow Manager</p>
            </div>

            <div className="flex items-center gap-6">
              {/* Status Indicators */}
              <div className="flex gap-4 text-xs">
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">{activeTasksCount}</div>
                  <div className="text-gray-400">Active</div>
                </div>
                <div className="border-l border-gray-600"></div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-lg">
                    {Object.values(state.cards).length}
                  </div>
                  <div className="text-gray-400">Total</div>
                </div>
                <div className="border-l border-gray-600"></div>
                <div className="text-center">
                  <div className="text-gray-400 font-bold text-lg">{completedCount}</div>
                  <div className="text-gray-400">Done</div>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition shadow-lg"
              >
                + NEW STAFFING
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 h-[calc(100vh-180px)]">
            {state.columnOrder.map(column => (
              <KanbanColumn
                key={column}
                column={column}
                cards={kanbanService.getCardsByColumn(state.cards, column)}
                formattedTimes={formattedTimes}
                urgencyLevels={urgencyLevels}
                onStart={handleStartTimer}
                onPause={handlePauseTimer}
                onReset={handleResetTimer}
                onUpdateNotes={handleUpdateNotes}
                onDelete={handleDeleteCard}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-gray-700 px-6 py-3 text-center text-gray-500 text-xs">
        <p>💾 All data saved locally • No servers • Work offline</p>
      </footer>

      {/* New Card Form Modal */}
      {showForm && (
        <NewCardForm
          onSubmit={handleCreateCard}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default App;
