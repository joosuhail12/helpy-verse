
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

/**
 * Custom typed dispatch hook to use throughout the application
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
