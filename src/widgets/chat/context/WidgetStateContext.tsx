
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ThemeConfig } from '@/context/ThemeContext';

// Define the widget state
interface WidgetState {
  isOpen: boolean;
  isInitialized: boolean;
  instanceId: string;
  theme: {
    position: 'left' | 'right';
    compact: boolean;
    colors?: {
      primary: string;
      [key: string]: string;
    };
  };
  config?: {
    workspaceId: string;
    [key: string]: any;
  };
}

// Define action types
type WidgetAction = 
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'INITIALIZE'; payload: { workspaceId: string; theme?: Partial<ThemeConfig>; settings?: any; instanceId?: string } }
  | { type: 'SET_THEME'; payload: Partial<ThemeConfig> };

// Create context
type WidgetStateContextType = {
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
};

const WidgetStateContext = createContext<WidgetStateContextType | undefined>(undefined);

// Initial state
const initialState: WidgetState = {
  isOpen: false,
  isInitialized: false,
  instanceId: 'default',
  theme: {
    position: 'right', // Always default to right
    compact: false,
    colors: {
      primary: '#9b87f5'
    }
  }
};

// Reducer function
function widgetReducer(state: WidgetState, action: WidgetAction): WidgetState {
  switch (action.type) {
    case 'TOGGLE_WIDGET':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case 'OPEN_WIDGET':
      return {
        ...state,
        isOpen: true
      };
    case 'CLOSE_WIDGET':
      return {
        ...state,
        isOpen: false
      };
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        instanceId: action.payload.instanceId || state.instanceId,
        config: {
          workspaceId: action.payload.workspaceId,
          ...state.config
        },
        theme: {
          ...state.theme,
          position: 'right', // Always force right positioning
          compact: action.payload.theme?.compact || state.theme.compact,
          colors: {
            ...state.theme.colors,
            ...(action.payload.theme?.colors || {})
          }
        }
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          position: 'right', // Always force right positioning
          compact: action.payload.compact || state.theme.compact,
          colors: {
            ...state.theme.colors,
            ...(action.payload.colors || {})
          }
        }
      };
    default:
      return state;
  }
}

// Persist widget state to localStorage based on instanceId
const persistState = (state: WidgetState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`chat-widget-state-${state.instanceId}`, JSON.stringify({
        isOpen: state.isOpen,
        theme: state.theme,
        config: state.config
      }));
    } catch (e) {
      console.error('Failed to persist widget state:', e);
    }
  }
};

// Load persisted state from localStorage based on instanceId
const loadPersistedState = (instanceId: string): Partial<WidgetState> => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(`chat-widget-state-${instanceId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load persisted widget state:', e);
    }
  }
  return {};
};

// Provider component
export const WidgetStateProvider: React.FC<{ children: ReactNode; instanceId?: string }> = ({ 
  children, 
  instanceId = 'default' 
}) => {
  // Load initial state from localStorage if available
  const persistedState = loadPersistedState(instanceId);
  const mergedInitialState = {
    ...initialState,
    ...persistedState,
    instanceId,
    theme: {
      ...initialState.theme,
      ...(persistedState.theme || {}),
      position: 'right' // Always enforce right positioning
    }
  };
  
  const [state, dispatch] = useReducer(widgetReducer, mergedInitialState);
  
  // Persist state changes to localStorage
  useEffect(() => {
    if (state.isInitialized) {
      persistState(state);
    }
  }, [state]);
  
  return (
    <WidgetStateContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

// Custom hook to use the context
export const useWidgetState = () => {
  const context = useContext(WidgetStateContext);
  if (context === undefined) {
    throw new Error('useWidgetState must be used within a WidgetStateProvider');
  }
  return context;
};
