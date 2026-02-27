'use client';

import React from 'react';
import { formatTime } from '@/utils/timeUtils';
import { Task } from '@/types';
import { Clock, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';

interface TopBarProps {
  activeTask: Task | null;
  totalTimeToday: number;
  activeTasks: number;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTask, totalTimeToday, activeTasks }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-dark-surface border-b border-dark-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {activeTask ? (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-status animate-pulse" />
              <div>
                <p className="text-xs text-neutral-400">{t('activeTask')}</p>
                <p className="text-sm font-semibold text-white">{activeTask.codename}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-neutral-400">{t('noActiveTask')}</p>
              <p className="text-sm font-semibold text-neutral-600">— </p>
            </div>
          )}

          <div className="border-l border-dark-border pl-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-white" />
              <div>
                <p className="text-xs text-neutral-400">{t('total')}</p>
                <p className="text-sm font-semibold text-white font-mono">{formatTime(totalTimeToday)}</p>
              </div>
            </div>
          </div>

          <div className="border-l border-dark-border pl-4">
            <p className="text-xs text-neutral-400">{t('activeTasks')}</p>
            <p className="text-sm font-semibold text-white">{activeTasks}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-neutral-500">
            <kbd className="bg-dark-bg px-1.5 py-0.5 rounded text-[10px]">N</kbd> {t('newTask')} • 
            <kbd className="bg-dark-bg px-1.5 py-0.5 rounded text-[10px] ml-2">SPACE</kbd> {t('timer')}
          </div>

          {/* Language Toggle */}
          <div className="border-l border-dark-border pl-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};
