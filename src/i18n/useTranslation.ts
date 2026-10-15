import { useAppState } from '../store/AppStateContext';
import { getTranslation } from './translations';

export function useTranslation() {
  const { language } = useAppState();
  return {
    t: getTranslation(language),
    language,
  };
}
