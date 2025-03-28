
import { useAppSelector } from '../useAppSelector';
import { RootState } from '../../store/store';

/**
 * Hook to provide standardized selectors for a slice
 * @param sliceName The name of the slice in the Redux store
 */
export const useStandardSelector = <T extends Record<string, any>>(
  sliceName: keyof RootState,
  customSelectors: Record<string, (state: RootState) => any> = {}
) => {
  const all = useAppSelector(state => state[sliceName] as unknown as T);
  const loading = useAppSelector(state => {
    const slice = state[sliceName] as any;
    return slice?.loading || false;
  });
  const error = useAppSelector(state => {
    const slice = state[sliceName] as any;
    return slice?.error || null;
  });
  const items = useAppSelector(state => {
    const slice = state[sliceName] as any;
    return slice?.items || [];
  });
  const selected = useAppSelector(state => {
    const slice = state[sliceName] as any;
    return slice?.selected || null;
  });
  
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
