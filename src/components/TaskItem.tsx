import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-green-100 text-green-700',
};

const categoryIcons = {
  meetings: '📅',
  research: '🔍',
  documents: '📄',
  'follow-up': '📞',
  other: '📌',
};

const statusIcons = {
  pending: '○',
  'in-progress': '◐',
  completed: '✓',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`group flex items-start gap-3 p-4 bg-white rounded-lg border border-apple-200 hover:border-apple-300 hover:shadow-apple-sm transition-all cursor-pointer ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      {/* Status Circle */}
      <button
        onClick={() => {
          const nextStatus = 
            task.status === 'pending' ? 'in-progress' :
            task.status === 'in-progress' ? 'completed' :
            'pending';
          onToggle({ ...task, status: nextStatus });
        }}
        className="mt-1 text-lg text-apple-400 hover:text-apple-600 transition-colors flex-shrink-0"
        title={`Status: ${task.status}`}
      >
        {statusIcons[task.status as keyof typeof statusIcons]}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div 
            className="flex-1 cursor-pointer group/title"
            onClick={() => onEdit(task)}
          >
            <h3 className={`text-sm font-medium leading-snug group-hover/title:text-blue-600 transition-colors ${isCompleted ? 'line-through text-apple-400' : 'text-apple-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-apple-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>

          {/* Category Badge */}
          <span className="text-lg flex-shrink-0">
            {categoryIcons[task.category as keyof typeof categoryIcons]}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          
          {task.dueDate && (
            <span className="text-xs text-apple-500 px-2 py-1 bg-apple-100 rounded-full">
              {new Date(task.dueDate).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
            </span>
          )}

          {task.estHours && (
            <span className="text-xs text-apple-600 px-2 py-1">
              ⏱ {task.estHours}h
            </span>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-apple-400 hover:text-red-600 text-lg flex-shrink-0"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
};
