'use client';

import React, { useState } from 'react';
import { ChevronDown, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Task } from '@/types';
import { formatTime } from '@/utils/timeUtils';

interface StatsPanelProps {
  activeTask: Task | null;
  totalTimeToday: number;
  activeTasks: number;
  allTasks: Task[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  activeTask,
  totalTimeToday,
  activeTasks,
  allTasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate stats
  const completedTasks = allTasks.filter((t) => t.columnId === 'completed').length;
  const waitingTasks = allTasks.filter((t) => t.columnId === 'waiting').length;
  const inProgressTasks = allTasks.filter((t) => t.columnId === 'in-progress').length;

  // Get active task time breakdown
  const activeDoingTime = activeTask?.doingTime || 0;
  const activeWaitingTime = activeTask?.waitingTime || 0;
  const activeFixingTime = activeTask?.fixingTime || 0;
  const activeTotalTime = activeDoingTime + activeWaitingTime + activeFixingTime;

  const getProgressColor = (time: number): string => {
    const minutes = time / 60;
    if (minutes < 30) return 'from-green-500 to-green-600';
    if (minutes < 90) return 'from-yellow-500 to-yellow-600';
    if (minutes < 180) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      {/* Collapsed View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full bg-gradient-to-r ${getProgressColor(
          activeTotalTime
        )} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 text-white ${
          isExpanded ? 'rounded-b-none' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Clock size={20} className="flex-shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-xs opacity-75 truncate">
                {activeTask ? activeTask.codename : 'Sem tarefa ativa'}
              </div>
              <div className="text-2xl font-bold">
                {formatTime(activeTotalTime || totalTimeToday)}
              </div>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`flex-shrink-0 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="absolute bottom-0 right-0 left-0 top-full bg-dark-surface border border-t-0 border-dark-border rounded-b-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Active Task Section */}
            {activeTask ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wide">
                    Tarefa Ativa
                  </h3>
                  <div className="mt-2 p-3 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="font-semibold text-lg text-white">
                      {activeTask.codename}
                    </div>
                    <div className="text-sm text-dark-text-secondary mt-1">
                      {activeTask.notes?.substring(0, 50)}
                    </div>
                  </div>
                </div>

                {/* Time Breakdown */}
                <div>
                  <h3 className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wide">
                    Tempo por Tipo
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {/* Doing */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="text-xs text-blue-400">Fazendo</div>
                      <div className="text-lg font-bold text-blue-400 mt-1">
                        {formatTime(activeDoingTime)}
                      </div>
                    </div>

                    {/* Waiting */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <div className="text-xs text-amber-400">Esperando</div>
                      <div className="text-lg font-bold text-amber-400 mt-1">
                        {formatTime(activeWaitingTime)}
                      </div>
                    </div>

                    {/* Fixing */}
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="text-xs text-purple-400">Ajustando</div>
                      <div className="text-lg font-bold text-purple-400 mt-1">
                        {formatTime(activeFixingTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(
                        activeTotalTime
                      )}`}
                      style={{
                        width: `${Math.min((activeTotalTime / 21600) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-dark-text-secondary mt-1">
                    {Math.min((activeTotalTime / 21600) * 100, 100).toFixed(0)}% do dia
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle size={32} className="mx-auto mb-2 text-amber-500" />
                <p className="text-sm text-dark-text-secondary">Nenhuma tarefa ativa</p>
                <p className="text-xs text-dark-text-tertiary mt-1">
                  Criar ou selecionar uma tarefa para começar
                </p>
              </div>
            )}

            {/* Daily Stats */}
            <div className="border-t border-dark-border pt-3">
              <h3 className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wide mb-3">
                Estatísticas do Dia
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="text-xs text-dark-text-secondary">Total de Tempo</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {formatTime(totalTimeToday)}
                  </div>
                </div>

                <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="text-xs text-dark-text-secondary">Tarefas Ativas</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">
                    {activeTasks}
                  </div>
                </div>

                <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="text-xs text-dark-text-secondary">Em Progresso</div>
                  <div className="text-xl font-bold text-blue-400 mt-1">
                    {inProgressTasks}
                  </div>
                </div>

                <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="text-xs text-dark-text-secondary">Finalizadas</div>
                  <div className="text-xl font-bold text-green-400 mt-1">
                    {completedTasks}
                  </div>
                </div>

                <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="text-xs text-dark-text-secondary">Aguardando</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    {waitingTasks}
                  </div>
                </div>

                <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="text-xs text-dark-text-secondary">Total</div>
                  <div className="text-xl font-bold text-purple-400 mt-1">
                    {allTasks.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
