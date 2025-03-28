
import { RootState } from '../store';

/**
 * Creates standard selector functions for a slice
 * @param sliceName The name of the slice in the Redux store
 */
export const createStandardSelectors = <T extends Record<string, any>>(sliceName: keyof RootState) => {
  return {
    selectAll: (state: RootState) => state[sliceName] as T,
    selectLoading: (state: RootState) => (state[sliceName] as any)?.loading || false,
    selectError: (state: RootState) => (state[sliceName] as any)?.error || null,
    selectById: (state: RootState, id: string) => {
      const items = (state[sliceName] as any)?.items || (state[sliceName] as any)?.['entities'] || [];
      return Array.isArray(items) 
        ? items.find((item: any) => item.id === id) 
        : items[id] || null;
    }
  };
};
