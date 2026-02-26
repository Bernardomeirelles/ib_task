import React from 'react';
import { Task } from '../types';

interface DashboardStatsProps {
  tasks: Task[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
  const urgentTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Tasks */}
      <div className="bg-white rounded-lg p-4 border border-apple-200 shadow-apple-sm">
        <div className="text-apple-500 text-sm font-medium mb-1">Total</div>
        <div className="text-3xl font-semibold text-apple-800">{stats.total}</div>
        <div className="text-xs text-apple-400 mt-2">Tarefas</div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-lg p-4 border border-apple-200 shadow-apple-sm">
        <div className="text-apple-500 text-sm font-medium mb-1">Pendentes</div>
        <div className="text-3xl font-semibold text-apple-800">{stats.pending}</div>
        <div className="text-xs text-apple-400 mt-2">À fazer</div>
      </div>

      {/* In Progress */}
      <div className="bg-white rounded-lg p-4 border border-apple-200 shadow-apple-sm">
        <div className="text-orange-600 text-sm font-medium mb-1">Em Andamento</div>
        <div className="text-3xl font-semibold text-orange-700">{stats.inProgress}</div>
        <div className="text-xs text-orange-400 mt-2">Ativas</div>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-lg p-4 border border-apple-200 shadow-apple-sm">
        <div className="text-green-600 text-sm font-medium mb-1">Completas</div>
        <div className="text-3xl font-semibold text-green-700">{stats.completed}</div>
        <div className="text-xs text-green-400 mt-2">{completionRate}%</div>
      </div>

      {/* Urgent if exists */}
      {urgentTasks > 0 && (
        <div className="col-span-2 md:col-span-4 bg-red-50 rounded-lg p-4 border border-red-200 shadow-apple-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-600 text-sm font-medium">⚠️ Tarefas Urgentes</div>
              <div className="text-red-700 text-xs mt-1">Você tem {urgentTasks} tarefa{urgentTasks !== 1 ? 's' : ''} de alta prioridade</div>
            </div>
            <div className="text-3xl font-semibold text-red-700">{urgentTasks}</div>
          </div>
        </div>
      )}
    </div>
  );
};
