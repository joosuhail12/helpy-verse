
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/store';

// Create a typed selector hook that knows about the RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
