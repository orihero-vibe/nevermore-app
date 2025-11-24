import { useCallback } from 'react';
import { useSettingsContent } from './useSettingsContent';
import { settingsService } from '../services/settings.service';

export const usePrivacyPolicy = () => {
  const fetcher = useCallback(() => settingsService.getPrivacyPolicy(), []);
  
  return useSettingsContent({
    fetcher,
    notFoundMessage: 'Privacy Policy content not found.',
    errorMessage: 'Failed to load Privacy Policy',
  });
};

