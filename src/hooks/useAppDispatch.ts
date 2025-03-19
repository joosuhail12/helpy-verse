
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

// Use the pre-typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Also export a named constant for convenience
export const useAppDispatchHook = useDispatch<AppDispatch>;
