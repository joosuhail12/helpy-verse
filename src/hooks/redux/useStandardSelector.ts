
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/store/store';

/**
 * Typed selector hook for use throughout the application
 */
export const useStandardSelector: TypedUseSelectorHook<RootState> = useSelector;
