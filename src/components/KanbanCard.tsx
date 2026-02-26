import React, { useState } from 'react';
import { StaffingCard, UrgencyLevel } from '../types';
import { kanbanService } from '../services/kanbanService';

interface CardProps {
  card: StaffingCard;
  formattedTime: string;
  urgencyLevel: UrgencyLevel;
  onStart: (cardId: string) => void;
  onPause: (cardId: string) => void;
  onReset: (cardId: string) => void;
  onUpdateNotes: (cardId: string, notes: string) => void;
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}

const urgencyColors = {
  low: 'border-green-600 bg-green-950',
  medium: 'border-yellow-600 bg-yellow-950',
  high: 'border-orange-600 bg-orange-950',
  critical: 'border-red-600 bg-red-950',
};

const urgencyBgDark = {
  low: 'bg-green-900/20',
  medium: 'bg-yellow-900/20',
  high: 'bg-orange-900/20',
  critical: 'bg-red-900/20',
};

const urgencyText = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

export const KanbanCard: React.FC<CardProps> = ({
  card,
  formattedTime,
  urgencyLevel,
  onStart,
  onPause,
  onReset,
  onUpdateNotes,
  onDelete,
  onDragStart,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(card.notes || '');

  const handleSaveNotes = () => {
    onUpdateNotes(card.id, noteText);
    setShowNotes(false);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      className={`border-l-4 rounded-lg p-4 cursor-move transition-all ${urgencyColors[urgencyLevel]} ${urgencyBgDark[urgencyLevel]} hover:shadow-lg`}
    >
      {/* Header: Codename + Staffing Time */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm tracking-wide">{card.codename}</h3>
          <p className="text-gray-400 text-xs mt-1">📍 {card.staffingTime}</p>
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className="text-gray-500 hover:text-red-400 transition text-lg ml-2"
          title="Delete"
        >
          ✕
        </button>
      </div>

      {/* Timer Display */}
      <div className={`text-center py-3 rounded mb-3 border border-gray-700 ${urgencyBgDark[urgencyLevel]}`}>
        <div className={`text-2xl font-mono font-bold ${urgencyText[urgencyLevel]}`}>
          {formattedTime}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {card.isActive ? '⏱️ RUNNING' : '⏸️ PAUSED'}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex gap-2 mb-3">
        {!card.isActive ? (
          <button
            onClick={() => onStart(card.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded transition"
          >
            ▶ START
          </button>
        ) : (
          <button
            onClick={() => onPause(card.id)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold py-2 rounded transition"
          >
            ⏸ PAUSE
          </button>
        )}

        <button
          onClick={() => onReset(card.id)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-2 rounded transition"
        >
          🔄 RESET
        </button>
      </div>

      {/* Notes Section */}
      <div className="border-t border-gray-700 pt-2">
        {!showNotes ? (
          <button
            onClick={() => setShowNotes(true)}
            className="text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1 transition"
          >
            📝 {card.notes ? 'Edit Notes' : 'Add Notes'}
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add quick notes..."
              className="w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs p-2 rounded resize-none h-16 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-1">
              <button
                onClick={handleSaveNotes}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 rounded transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowNotes(false);
                  setNoteText(card.notes || '');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {card.notes && !showNotes && (
          <p className="text-gray-400 text-xs mt-2 line-clamp-2">{card.notes}</p>
        )}
      </div>
    </div>
  );
};
