import { useLanguage } from '@/hooks/useLanguage';
import { getTranslation, TranslationKey } from '@/utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return { t, language };
};
