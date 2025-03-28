
import { RootState } from '../store';

/**
 * Creates standard selector functions for a slice
 * @param sliceName The name of the slice in the Redux store
 */
export const createStandardSelectors = <T extends Record<string, any>>(sliceName: keyof RootState) => {
  return {
    selectAll: (state: RootState) => state[sliceName] as unknown as T,
    selectLoading: (state: RootState) => {
      const slice = state[sliceName] as any;
      return slice?.loading || false;
    },
    selectError: (state: RootState) => {
      const slice = state[sliceName] as any;
      return slice?.error || null;
    },
    selectById: (state: RootState, id: string) => {
      const slice = state[sliceName] as any;
      const items = slice?.items || slice?.['entities'] || [];
      
      return Array.isArray(items) 
        ? items.find((item: any) => item.id === id) 
        : items[id] || null;
    }
  };
};
