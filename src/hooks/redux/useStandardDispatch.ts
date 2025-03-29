
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';

/**
 * Typed dispatch hook for use throughout the application
 */
export const useStandardDispatch = () => useDispatch<AppDispatch>();
