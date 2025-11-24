import { useCallback } from 'react';
import { useSettingsContent } from './useSettingsContent';
import { settingsService } from '../services/settings.service';

export const useTermsAndConditions = () => {
  const fetcher = useCallback(() => settingsService.getTermsAndConditions(), []);
  
  return useSettingsContent({
    fetcher,
    notFoundMessage: 'Terms & Conditions content not found.',
    errorMessage: 'Failed to load Terms & Conditions',
  });
};

