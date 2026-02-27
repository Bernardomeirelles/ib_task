'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/utils/translations';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('ib_language') as Language | null;
    if (saved) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ib_language', lang);
  };

  return { language, setLanguage };
};
