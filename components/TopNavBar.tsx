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
      </div>
    </nav>
  );
};
