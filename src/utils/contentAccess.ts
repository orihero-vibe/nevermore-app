const FREE_TEMPTATION_COUNT_PER_CATEGORY = 1;
const FREE_JOURNEY_DAYS = 3;
const MAX_FREE_CATEGORIES = 3;

/** Category-like shape for free-temptation check (needs freeTemptationContentId). */
export interface CategoryFreeFlag {
  freeTemptationContentId?: string | null;
  [key: string]: unknown;
}

/**
 * Whether a temptation is free (no subscription required).
 * Uses backend flag when category has freeTemptationContentId; otherwise falls back to
 * first item (index 0) in each of the first 3 categories.
 */
export function isTemptationFree(
  contentId: string,
  category: CategoryFreeFlag,
  fallbackCategoryIndex?: number,
  fallbackItemIndexInCategory?: number
): boolean {
  const freeId = category.freeTemptationContentId;
  if (freeId != null && freeId !== '') {
    return freeId === contentId;
  }
  if (fallbackCategoryIndex !== undefined && fallbackItemIndexInCategory !== undefined) {
    return (
      fallbackCategoryIndex < MAX_FREE_CATEGORIES &&
      fallbackItemIndexInCategory < FREE_TEMPTATION_COUNT_PER_CATEGORY
    );
  }
  return false;
}

/**
 * Whether a 40-day journey day is free (no subscription required).
 * Uses content.isFree when provided (only Day 1–3 may be free); otherwise Day 1, 2, 3.
 */
export function isJourneyDayFree(dayNumber: number, contentIsFree?: boolean): boolean {
  if (contentIsFree !== undefined) {
    return contentIsFree && dayNumber <= FREE_JOURNEY_DAYS;
  }
  return dayNumber <= FREE_JOURNEY_DAYS;
}

export const FREE_JOURNEY_DAYS_COUNT = FREE_JOURNEY_DAYS;
export const MAX_FREE_CATEGORIES_COUNT = MAX_FREE_CATEGORIES;
