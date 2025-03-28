
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

/**
 * Creates standard memoized selector functions for a slice
 * @param sliceName The name of the slice in the Redux store
 */
export const createStandardSelectors = <T extends Record<string, any>>(sliceName: keyof RootState) => {
  // Base selector to get the slice state
  const getSliceState = (state: RootState) => state[sliceName] as unknown as T;
  
  // Memoized selectors
  return {
    selectAll: createSelector(
      [getSliceState],
      (sliceState) => sliceState
    ),
    
    selectLoading: createSelector(
      [getSliceState],
      (sliceState) => {
        return (sliceState as any)?.loading || false;
      }
    ),
    
    selectError: createSelector(
      [getSliceState],
      (sliceState) => {
        return (sliceState as any)?.error || null;
      }
    ),
    
    selectById: (id: string) => createSelector(
      [getSliceState],
      (sliceState) => {
        const items = (sliceState as any)?.items || (sliceState as any)?.['entities'] || [];
        
        return Array.isArray(items) 
          ? items.find((item: any) => item.id === id) 
          : items[id] || null;
      }
    ),
    
    selectItems: createSelector(
      [getSliceState],
      (sliceState) => {
        return (sliceState as any)?.items || [];
      }
    ),
    
    selectSelected: createSelector(
      [getSliceState],
      (sliceState) => {
        return (sliceState as any)?.selected || (sliceState as any)?.selectedItem || null;
      }
    )
  };
};
