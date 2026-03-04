'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { X, Search } from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';

interface TaskSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  currentColumn?: string;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  currentColumn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter tasks based on current column or show all non-completed tasks
  const availableTasks = tasks.filter(
    (task) => task.columnId !== 'completed'
  );

  const filteredTasks = availableTasks.filter((task) =>
    task.codename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredTasks.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTasks[selectedIndex]) {
          onSelectTask(filteredTasks[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTasks, selectedIndex, onSelectTask, onClose]);

  if (!isOpen) return null;

  const getColumnLabel = (columnId: string) => {
    switch (columnId) {
      case 'incoming':
        return 'Backlog';
      case 'in-progress':
        return 'Fazendo';
      case 'waiting':
        return 'Aguardando';
      case 'adjusting-comments':
        return 'Correção';
      default:
        return columnId;
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'incoming':
        return 'bg-neutral-500/20 text-neutral-700';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-700';
      case 'waiting':
        return 'bg-amber-500/20 text-amber-700';
      case 'adjusting-comments':
        return 'bg-purple-500/20 text-purple-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Selecionar Tarefa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Buscar tarefa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
              Nenhuma tarefa encontrada
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTasks.map((task, index) => {
                const totalTime = task.doingTime + task.waitingTime + task.fixingTime;
                return (
                  <button
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      index === selectedIndex
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {task.codename}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${getColumnColor(
                              task.columnId
                            )}`}
                          >
                            {getColumnLabel(task.columnId)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Staffing: {task.staffingTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-gray-500">Tempo Total</div>
                        <div className="text-sm font-mono font-semibold text-gray-900">
                          {formatTime(totalTime)}
                        </div>
                        {task.isActive && (
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            ● Ativo
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">↑↓</span> Navegar •{' '}
              <span className="font-semibold">Enter</span> Selecionar •{' '}
              <span className="font-semibold">Esc</span> Fechar
            </div>
            <div>{filteredTasks.length} tarefas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
