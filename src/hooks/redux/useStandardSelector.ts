
import { useAppSelector } from '../useAppSelector';
import { RootState } from '../../store/store';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Hook to provide standardized selectors for a slice
 * @param sliceName The name of the slice in the Redux store
 */
export const useStandardSelector = <T extends Record<string, any>>(
  sliceName: keyof RootState,
  customSelectors: Record<string, (state: RootState) => any> = {}
) => {
  // Create base selectors
  const selectSlice = (state: RootState) => state[sliceName] as unknown as T;
  
  const selectLoading = createSelector(
    [selectSlice],
    (slice) => (slice as any)?.loading || false
  );
  
  const selectError = createSelector(
    [selectSlice],
    (slice) => (slice as any)?.error || null
  );
  
  const selectItems = createSelector(
    [selectSlice],
    (slice) => (slice as any)?.items || []
  );
  
  const selectSelected = createSelector(
    [selectSlice],
    (slice) => (slice as any)?.selected || null
  );
  
  // Use the selectors with our hook
  const all = useAppSelector(selectSlice);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const items = useAppSelector(selectItems);
  const selected = useAppSelector(selectSelected);
  
  // Apply any custom selectors
  const customSelectorValues = Object.entries(customSelectors).reduce((acc, [key, selector]) => {
    acc[key] = useAppSelector(selector);
    return acc;
  }, {} as Record<string, any>);
  
  return {
    all,
    loading,
    error,
    items,
    selected,
    ...customSelectorValues
  };
};
