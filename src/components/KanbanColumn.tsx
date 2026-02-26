import React from 'react';
import { StaffingCard, ColumnType, UrgencyLevel } from '../types';
import { KanbanCard } from './KanbanCard';

interface ColumnProps {
  column: ColumnType;
  cards: StaffingCard[];
  formattedTimes: Record<string, string>;
  urgencyLevels: Record<string, UrgencyLevel>;
  onStart: (cardId: string) => void;
  onPause: (cardId: string) => void;
  onReset: (cardId: string) => void;
  onUpdateNotes: (cardId: string, notes: string) => void;
  onDelete: (cardId: string) => void;
  onDrop: (e: React.DragEvent, column: ColumnType) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}

const columnConfig = {
  incoming: { 
    title: '📥 INCOMING', 
    icon: '📨',
    gradient: 'from-blue-950/30 to-slate-900/30',
    borderColor: 'border-blue-500/30',
    bgLight: 'bg-blue-950/10',
  },
  'in-progress': { 
    title: '⚡ IN PROGRESS',
    icon: '⚙️',
    gradient: 'from-purple-950/30 to-slate-900/30',
    borderColor: 'border-purple-500/30',
    bgLight: 'bg-purple-950/10',
  },
  waiting: { 
    title: '⏳ WAITING / COMMENTS',
    icon: '💬',
    gradient: 'from-amber-950/30 to-slate-900/30',
    borderColor: 'border-amber-500/30',
    bgLight: 'bg-amber-950/10',
  },
  completed: { 
    title: '✅ COMPLETED',
    icon: '🎉',
    gradient: 'from-emerald-950/30 to-slate-900/30',
    borderColor: 'border-emerald-500/30',
    bgLight: 'bg-emerald-950/10',
  },
};

export const KanbanColumn: React.FC<ColumnProps> = ({
  column,
  cards,
  formattedTimes,
  urgencyLevels,
  onStart,
  onPause,
  onReset,
  onUpdateNotes,
  onDelete,
  onDrop,
  onDragOver,
  onDragStart,
}) => {
  const config = columnConfig[column];
  const activeCards = cards.filter(c => c.isActive).length;

  return (
    <div
      className={`bg-gradient-to-br ${config.gradient} rounded-xl border ${config.borderColor} p-5 flex flex-col h-full backdrop-blur-sm transition-all duration-300 hover:border-opacity-60`}
      onDrop={(e) => onDrop(e, column)}
      onDragOver={onDragOver}
    >
      {/* Column Header - Premium */}
      <div className={`mb-4 pb-4 border-b border-gray-700/50 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <span className="text-lg animate-float">{config.icon}</span>
              {config.title}
            </h2>
            <p className="text-gray-400 text-xs mt-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center font-bold">
                {cards.length}
              </span>
              {cards.length === 1 ? 'assignment' : 'assignments'}
              {activeCards > 0 && (
                <>
                  <span className="text-green-400 font-semibold">•</span>
                  <span className="text-green-400 text-xs font-semibold animate-pulse">{activeCards} live</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {cards.length === 0 ? (
          <div className={`text-center py-12 transition-all duration-300 ${config.bgLight} rounded-lg border border-dashed border-gray-600/50`}>
            <div className="text-4xl mb-2 animate-bounce-light opacity-50">━</div>
            <p className="text-gray-500 font-semibold">No tasks</p>
            <p className="text-gray-600 text-xs mt-1">Drag a card here to get started</p>
          </div>
        ) : (
          cards.map((card, index) => (
            <div 
              key={card.id}
              className="animate-slide-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <KanbanCard
                card={card}
                formattedTime={formattedTimes[card.id] || '00:00:00'}
                urgencyLevel={urgencyLevels[card.id] || 'low'}
                onStart={onStart}
                onPause={onPause}
                onReset={onReset}
                onUpdateNotes={onUpdateNotes}
                onDelete={onDelete}
                onDragStart={onDragStart}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
