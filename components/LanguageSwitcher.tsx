'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-neutral-400" />
      <button
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        className="px-2 py-1 text-xs bg-dark-bg border border-dark-border rounded text-white hover:bg-dark-border transition"
      >
        {language === 'pt' ? 'EN' : 'PT'}
      </button>
    </div>
  );
};
