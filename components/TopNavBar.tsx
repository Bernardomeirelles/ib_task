'use client';

import React from 'react';
import { Clock, Zap, AlertCircle } from 'lucide-react';
import { Task } from '@/types';
import { formatTime } from '@/utils/timeUtils';
import { LanguageSwitcher } from './LanguageSwitcher';

interface TopNavBarProps {
  activeTask: Task | null;
  totalTimeToday: number;
  activeTasks: number;
  allTasks: Task[];
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTask,
  totalTimeToday,
  activeTasks,
  allTasks,
}) => {
  const completedTasks = allTasks.filter((t) => t.columnId === 'completed').length;
  const waitingTasks = allTasks.filter((t) => t.columnId === 'waiting').length;
  const fixingTasks = allTasks.filter((t) => t.columnId === 'adjusting-comments').length;
  const doingTasks = allTasks.filter((t) => t.columnId === 'in-progress').length;
  const backlogTasks = allTasks.filter((t) => t.columnId === 'incoming').length;

  const activeTaskTime = activeTask
    ? (activeTask.doingTime || 0) +
      (activeTask.waitingTime || 0) +
      (activeTask.fixingTime || 0)
    : 0;

  return (
    <nav className="bg-[#E60000] border-b border-red-800 sticky top-0 z-50 shadow-md">
      <div className="px-6 py-3 space-y-3">
        {/* Row 1: Active Task + Language */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {activeTask ? (
              <>
                <Zap size={16} className="text-white flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-white/80">Tarefa</div>
                  <div className="text-sm font-semibold text-white truncate">
                    {activeTask.codename}
                  </div>
                </div>
                <div className="text-right ml-auto">
                  <div className="text-xs text-white/80">Tempo</div>
                  <div className="text-sm font-bold text-white">
                    {formatTime(activeTaskTime)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-white/60 flex-shrink-0" />
                <div>
                  <div className="text-xs text-white/80">Nenhuma tarefa ativa</div>
                </div>
              </>
            )}
          </div>

          <div className="flex-shrink-0 border-l border-white/30 pl-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Row 2: Stats */}
        <div className="grid grid-cols-6 gap-2">
          {/* Total */}
          <div className="bg-white/20 rounded-lg p-2 border border-white/30">
            <div className="text-xs text-white/80">Total</div>
            <div className="text-base font-bold text-white">
              {formatTime(totalTimeToday)}
            </div>
          </div>

          {/* Backlog */}
          <div className="bg-white/20 rounded-lg p-2 border border-white/30">
            <div className="text-xs text-white/80">Backlog</div>
            <div className="text-base font-bold text-white">{backlogTasks}</div>
          </div>

          {/* Fazendo */}
          <div className="bg-white/20 rounded-lg p-2 border border-white/30">
            <div className="text-xs text-white/80">Fazendo</div>
            <div className="text-base font-bold text-white">{doingTasks}</div>
          </div>

          {/* Aguardando */}
          <div className="bg-white/20 rounded-lg p-2 border border-white/30">
            <div className="text-xs text-white/80">Aguardando</div>
            <div className="text-base font-bold text-white">{waitingTasks}</div>
          </div>

          {/* Correção */}
          <div className="bg-white/20 rounded-lg p-2 border border-white/30">
            <div className="text-xs text-white/80">Correção</div>
            <div className="text-base font-bold text-white">{fixingTasks}</div>
          </div>

          {/* Feito */}
          <div className="bg-white/20 rounded-lg p-2 border border-white/30">
            <div className="text-xs text-white/80">Feito</div>
            <div className="text-base font-bold text-white">{completedTasks}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
