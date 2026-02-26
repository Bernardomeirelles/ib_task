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
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumn: ColumnType) => {
    e.preventDefault();
    if (!draggedCardId) return;

    const card = state.cards[draggedCardId];
    if (card && card.columnType !== targetColumn) {
      const movedCard = kanbanService.moveCard(card, targetColumn);
      const newState = { ...state };
      newState.cards[draggedCardId] = movedCard;
      setState(newState);
    }

    setDraggedCardId(null);
  };

  // Calculate stats
  const activeTasksCount = Object.values(state.cards).filter(c => c.isActive).length;
  const completedCount = Object.values(state.cards).filter(c => c.columnType === 'completed').length;
  const totalCards = Object.values(state.cards).length;
  const completionRate = totalCards === 0 ? 0 : Math.round((completedCount / totalCards) * 100);
  const avgTimeLiveCards = Object.values(state.cards)
    .filter(c => c.columnType !== 'completed')
    .reduce((sum, c) => sum + c.elapsedTime, 0) / Math.max(totalCards - completedCount, 1);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-950/95 via-slate-950/95 to-slate-900/95 border-b border-blue-500/20 backdrop-blur-md shadow-card">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Title Section */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl animate-float">🏛️</div>
                <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text tracking-wider">
                  IB STAFFING BOARD
                </h1>
              </div>
              <p className="text-gray-400 text-sm font-mono">Investment Banking Workflow Manager • Real-Time Task Tracking</p>
            </div>

            {/* Status Indicators - Premium */}
            <div className="flex items-center gap-8 px-6 py-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-green-400 font-black text-3xl animate-glow">{activeTasksCount}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">Active</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="text-blue-400 font-black text-3xl">{totalCards}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">Total</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="text-emerald-400 font-black text-3xl">{completedCount}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">Complete</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="text-yellow-400 font-black text-2xl">{completionRate}%</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">Progress</div>
              </div>
            </div>

            {/* Create Button - Premium */}
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-glow-blue hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <span>+</span>
              NEW STAFFING
            </button>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {state.columnOrder.map((column, index) => (
              <div key={column} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <KanbanColumn
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
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-950/95 to-slate-900/95 border-t border-blue-500/20 backdrop-blur-md px-8 py-4 text-center">
        <p className="text-gray-500 text-sm font-mono">
          💾 All data persisted locally • ⚡ Real-time timers • 🔒 100% Offline • Premium UI
        </p>
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
