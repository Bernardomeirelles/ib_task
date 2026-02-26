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
  low: 'border-emerald-500 bg-emerald-950/40 hover:shadow-glow-green',
  medium: 'border-yellow-500 bg-yellow-950/40 hover:shadow-glow-yellow',
  high: 'border-orange-500 bg-orange-950/40 hover:shadow-glow-orange',
  critical: 'border-red-500 bg-red-950/40 hover:shadow-glow-red urgency-critical',
};

const urgencyTextColor = {
  low: 'text-emerald-300',
  medium: 'text-yellow-300',
  high: 'text-orange-300',
  critical: 'text-red-300',
};

const buttonColors = {
  low: 'bg-emerald-600 hover:bg-emerald-700 shadow-glow-green',
  medium: 'bg-yellow-600 hover:bg-yellow-700 shadow-glow-yellow',
  high: 'bg-orange-600 hover:bg-orange-700 shadow-glow-orange',
  critical: 'bg-red-600 hover:bg-red-700 shadow-glow-red',
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
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(card.id, noteText);
    setShowNotes(false);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`border-l-4 rounded-lg p-4 cursor-move transition-all duration-300 ${urgencyColors[urgencyLevel]} hover:shadow-card backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 group animate-fade-in`}
    >
      {/* Header: Codename + Staffing Time */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm tracking-wide uppercase transition-all duration-300 group-hover:text-blue-300">
            {card.codename}
          </h3>
          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
            <span className={isHovered ? 'animate-bounce-light' : ''}>📍</span>
            {card.staffingTime}
          </p>
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className={`opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-500 hover:text-red-400 text-lg ml-2 transform hover:scale-110`}
          title="Delete"
        >
          ✕
        </button>
      </div>

      {/* Timer Display - Premium */}
      <div className={`text-center py-4 rounded-lg mb-3 border border-gray-700/50 transition-all duration-300 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xs ${
        card.isActive ? 'shadow-glow-blue' : ''
      }`}>
        <div className={`text-3xl font-mono font-bold tracking-wider transition-all duration-300 ${urgencyTextColor[urgencyLevel]}`}>
          {formattedTime}
        </div>
        <div className={`text-xs mt-2 font-semibold transition-all duration-300 ${
          card.isActive 
            ? 'text-green-400 animate-pulse' 
            : 'text-gray-500'
        }`}>
          {card.isActive ? '⏱️ LIVE TRACKING' : '⏸️ PAUSED'}
        </div>
      </div>

      {/* Timer Controls - Premium */}
      <div className="flex gap-2 mb-3">
        {!card.isActive ? (
          <button
            onClick={() => onStart(card.id)}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-glow-green hover:shadow-lg active:scale-95"
          >
            ▶ START
          </button>
        ) : (
          <button
            onClick={() => onPause(card.id)}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-glow-yellow hover:shadow-lg active:scale-95"
          >
            ⏸ PAUSE
          </button>
        )}

        <button
          onClick={() => onReset(card.id)}
          className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
        >
          🔄 RESET
        </button>
      </div>

      {/* Notes Section - Premium */}
      <div className="border-t border-gray-700/50 pt-3">
        {!showNotes ? (
          <button
            onClick={() => setShowNotes(true)}
            className="text-gray-400 hover:text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 group/notes"
          >
            <span className="transition-transform duration-300 group-hover/notes:scale-110">📝</span>
            {card.notes ? 'Edit Notes' : 'Add Notes'}
          </button>
        ) : (
          <div className="space-y-2 animate-scale-in">
            <textarea
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Quick notes or context..."
              className="w-full bg-slate-900/80 border border-blue-500/50 text-gray-200 text-xs p-3 rounded-lg resize-none h-20 focus:outline-none focus:border-blue-400 focus:shadow-glow-blue transition-all duration-300 placeholder-gray-600"
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleSaveNotes}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-glow-blue active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowNotes(false);
                  setNoteText(card.notes || '');
                }}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {card.notes && !showNotes && (
          <p className="text-gray-400 text-xs mt-2 line-clamp-2 italic border-l-2 border-blue-500/50 pl-2">
            {card.notes}
          </p>
        )}
      </div>
    </div>
  );
};
