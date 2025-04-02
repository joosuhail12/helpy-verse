
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/store/store';

/**
 * Custom hook for typed selector
 * Use throughout the app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
