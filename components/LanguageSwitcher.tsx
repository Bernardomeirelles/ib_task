'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-white/80" />
      <button
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        className="px-2 py-1 text-xs bg-white/20 border border-white/40 rounded text-white hover:bg-white/30 transition font-semibold"
      >
        {language === 'pt' ? 'EN' : 'PT'}
      </button>
    </div>
  );
};
