import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  filter: 'all' | 'pending' | 'in-progress' | 'completed';
  categoryFilter: TaskCategory | 'all';
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  filter,
  categoryFilter,
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('priority');

  // Apply filters
  let filtered = tasks;

  if (filter !== 'all') {
    filtered = filtered.filter(t => t.status === filter);
  }

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(t => t.category === categoryFilter);
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      // Also sort completed tasks to bottom
      const aCompleted = a.status === 'completed' ? 1 : 0;
      const bCompleted = b.status === 'completed' ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }

    return 0;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">✨</div>
        <p className="text-apple-500 font-medium">Nenhuma tarefa aqui</p>
        <p className="text-apple-400 text-sm mt-1">
          {categoryFilter !== 'all'
            ? 'Nenhuma tarefa nesta categoria'
            : filter === 'completed'
            ? 'Complete tarefas para vê-las aqui'
            : 'Crie uma nova tarefa para começar'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-apple-100">
        <div className="text-sm font-medium text-apple-600">
          {filtered.length} tarefa{filtered.length !== 1 ? 's' : ''}
        </div>
        <div className="flex gap-2">
          {(['priority', 'date', 'category'] as const).map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                sortBy === sort
                  ? 'bg-blue-600 text-white'
                  : 'bg-apple-100 text-apple-600 hover:bg-apple-200'
              }`}
            >
              {sort === 'priority' && '⬇ Prioridade'}
              {sort === 'date' && '📅 Data'}
              {sort === 'category' && '🏷 Categoria'}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {sorted.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};
