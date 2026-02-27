'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { formatTime, getTaskColorBorder } from '@/utils/timeUtils';
import { Play, Pause, Trash2, MessageSquare, BarChart3 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  elapsedTime: number;
  onToggleTimer: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onSendToAnalytics: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  elapsedTime,
  onToggleTimer,
  onDelete,
  onUpdateNotes,
  onSendToAnalytics,
}) => {
  const isCompleted = task.columnId === 'completed';
  const isBacklog = task.columnId === 'incoming';
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes);

  const handleSaveNotes = () => {
    onUpdateNotes(task.id, notes);
    setShowNotes(false);
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setShowNotes(false);
      setNotes(task.notes);
    }
    setIsExpanded(!isExpanded);
  };

  const colorBorder = getTaskColorBorder(elapsedTime);
  const columnAccent =
    task.columnId === 'incoming'
      ? 'border-t-neutral-500'
      : task.columnId === 'in-progress'
        ? 'border-t-blue-500'
        : task.columnId === 'waiting'
          ? 'border-t-amber-400'
          : task.columnId === 'adjusting-comments'
            ? 'border-t-purple-500'
            : 'border-t-emerald-500';
  const columnPill =
    task.columnId === 'incoming'
      ? 'bg-neutral-600/30 text-neutral-200'
      : task.columnId === 'in-progress'
        ? 'bg-blue-500/20 text-blue-300'
        : task.columnId === 'waiting'
          ? 'bg-amber-500/20 text-amber-300'
          : task.columnId === 'adjusting-comments'
            ? 'bg-purple-500/20 text-purple-300'
            : 'bg-emerald-500/20 text-emerald-300';
  const columnLabel =
    task.columnId === 'incoming'
      ? 'Backlog'
      : task.columnId === 'in-progress'
        ? 'Fazendo'
        : task.columnId === 'waiting'
          ? 'Aguardando'
          : task.columnId === 'adjusting-comments'
            ? 'Correção'
            : 'Feito';

  return (
    <div
      className={`bg-white border-l-4 border-t-2 ${colorBorder} ${columnAccent} rounded p-3 shadow-sm transition ${
        isCompleted ? 'cursor-default' : 'hover:shadow-md cursor-move'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3" onClick={handleToggleExpand} role="button" aria-expanded={isExpanded}>
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-gray-900 text-xs truncate">
            {task.codename}
          </h3>
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${columnPill}`}>{columnLabel}</span>
          {task.isActive && task.activeTimerType && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
              {task.activeTimerType === 'doing' ? 'D' : task.activeTimerType === 'waiting' ? 'W' : 'F'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-gray-900">{formatTime(elapsedTime)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCompleted && !isBacklog) {
                onToggleTimer(task.id);
              }
            }}
            className={`p-2 rounded transition ${
              isCompleted || isBacklog
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : task.isActive
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
            title={isBacklog ? 'Mova para "Fazendo" para iniciar' : isCompleted ? 'Tarefa finalizada' : task.isActive ? 'Pausar' : 'Iniciar'}
            disabled={isCompleted || isBacklog}
          >
            {task.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <div className="text-xs text-gray-600">
            Staffing Time: <span className="text-gray-900">{task.staffingTime}</span>
          </div>

          {/* Time breakdown */}
          <div className="bg-gray-50 rounded p-2 space-y-1 text-xs">
            <div className="flex justify-between text-gray-700">
              <span>Doing Time:</span>
              <span className="font-mono">{formatTime(task.doingTime)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Waiting Time:</span>
              <span className="font-mono">{formatTime(task.waitingTime)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Fixing Time:</span>
              <span className="font-mono">{formatTime(task.fixingTime)}</span>
            </div>
            <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between text-gray-900 font-semibold">
              <span>Total Time (D+F):</span>
              <span className="font-mono">{formatTime(task.doingTime + task.fixingTime)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotes(!showNotes);
              }}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{notes ? 'Edit notes' : 'Add notes'}</span>
            </button>

            {showNotes && (
              <div className="bg-gray-50 rounded p-2 space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Quick notes..."
                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-xs focus:outline-none focus:border-gray-500 resize-none h-20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveNotes();
                    }}
                    className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotes(false);
                      setNotes(task.notes);
                    }}
                    className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {notes && !showNotes && (
              <p className="text-xs text-gray-700 bg-gray-50 rounded p-2 italic">{notes}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendToAnalytics(task.id);
                }}
                className="text-xs text-gray-600 hover:text-gray-900 transition"
                title="Send to analytics"
              >
                <span className="inline-flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Send to analytics
                </span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-xs text-gray-600 hover:text-red-600 transition"
              title="Delete task"
            >
              <span className="inline-flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete task
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
