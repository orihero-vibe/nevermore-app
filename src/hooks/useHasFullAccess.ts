import { useMemo } from 'react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useTrialStore } from '../store/trialStore';

export function useHasFullAccess(): boolean {
  const isSubscribed = useSubscriptionStore((s) => s.isSubscribed);
  const trialStartDate = useTrialStore((s) => s.trialStartDate);

  return useMemo(() => {
    return isSubscribed || useTrialStore.getState().isTrialActive();
  }, [isSubscribed, trialStartDate]);
}
