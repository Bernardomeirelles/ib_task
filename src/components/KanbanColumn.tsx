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
  incoming: { title: '📥 INCOMING', bgColor: 'bg-slate-800', borderColor: 'border-slate-700' },
  'in-progress': { title: '⚡ IN PROGRESS', bgColor: 'bg-slate-800', borderColor: 'border-slate-700' },
  waiting: { title: '⏳ WAITING / COMMENTS', bgColor: 'bg-slate-800', borderColor: 'border-slate-700' },
  completed: { title: '✅ COMPLETED', bgColor: 'bg-slate-800', borderColor: 'border-slate-700' },
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

  return (
    <div
      className={`${config.bgColor} rounded-lg border ${config.borderColor} p-4 flex flex-col h-full`}
      onDrop={(e) => onDrop(e, column)}
      onDragOver={onDragOver}
    >
      {/* Column Header */}
      <div className="mb-4 pb-3 border-b border-gray-700">
        <h2 className="text-white font-bold text-sm tracking-widest">{config.title}</h2>
        <p className="text-gray-400 text-xs mt-1">
          {cards.length} {cards.length === 1 ? 'assignment' : 'assignments'}
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">━</div>
            <p className="text-xs">No tasks</p>
          </div>
        ) : (
          cards.map(card => (
            <KanbanCard
              key={card.id}
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
          ))
        )}
      </div>
    </div>
  );
};
