
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';

/**
 * Custom hook for typed dispatch
 * Use throughout the app instead of plain `useDispatch`
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
