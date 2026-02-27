'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'createdAt' | 'doingTime' | 'waitingTime' | 'fixingTime' | 'isActive' | 'timerStartedAt' | 'activeTimerType'>) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { t } = useTranslation();
  const [codename, setCodename] = useState('');
  const [staffingTime, setStaffingTime] = useState('');

  const handleCreate = () => {
    if (!codename.trim() || !staffingTime.trim()) {
      alert(t('newTaskTitle'));
      return;
    }

    onCreate({
      codename: codename.trim(),
      staffingTime: staffingTime.trim(),
      columnId: 'incoming',
      notes: '',
    });

    setCodename('');
    setStaffingTime('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-96 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{t('newTaskTitle')}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-neutral-600/20 border border-neutral-600 rounded flex items-center gap-2">
          <span className="text-sm text-neutral-300">{t('willBeAddedTo')}</span>
          <span className="inline-flex items-center px-2 py-1 bg-neutral-600/30 text-neutral-100 rounded text-xs font-medium">
            + {t('incoming')}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-2">{t('taskCodename')}</label>
            <input
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="e.g., Project Falcon, Deck Update"
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white text-sm focus:outline-none focus:border-neutral-500 transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-2">{t('staffingTimeEstimate')}</label>
            <input
              type="text"
              value={staffingTime}
              onChange={(e) => setStaffingTime(e.target.value)}
              placeholder={t('staffingTimePlaceholder')}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white text-sm focus:outline-none focus:border-neutral-500 transition"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded text-white text-sm hover:bg-dark-border transition"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-green-status text-white rounded text-sm font-medium hover:bg-opacity-90 transition"
            >
              {t('create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
