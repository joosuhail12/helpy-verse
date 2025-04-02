
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
          position: 'right' as const, // Force right positioning with type assertion
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
          position: 'right' as const, // Force right positioning with type assertion
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

// Provider component
interface WidgetStateProviderProps {
  children: ReactNode;
  instanceId?: string;
}

export const WidgetStateProvider: React.FC<WidgetStateProviderProps> = ({ 
  children, 
  instanceId = 'default' 
}) => {
  // Initialize state with instanceId
  const actualInitialState: WidgetState = {
    ...initialState,
    instanceId
  };

  const [state, dispatch] = useReducer(widgetReducer, actualInitialState);

  // Persist widget state to localStorage based on instanceId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`chat-widget-state-${state.instanceId}`, JSON.stringify({
          isOpen: state.isOpen,
          theme: state.theme
        }));
      } catch (error) {
        console.error('Failed to persist widget state:', error);
      }
    }
  }, [state.isOpen, state.theme, state.instanceId]);

  // Set up event listeners for external control
  useEffect(() => {
    const handleOpenEvent = () => dispatch({ type: 'OPEN_WIDGET' });
    const handleCloseEvent = () => dispatch({ type: 'CLOSE_WIDGET' });
    const handleToggleEvent = () => dispatch({ type: 'TOGGLE_WIDGET' });

    // Add namespaced event listeners to prevent cross-widget interference
    window.addEventListener(`chat-widget-open-${instanceId}`, handleOpenEvent);
    window.addEventListener(`chat-widget-close-${instanceId}`, handleCloseEvent);
    window.addEventListener(`chat-widget-toggle-${instanceId}`, handleToggleEvent);

    return () => {
      window.removeEventListener(`chat-widget-open-${instanceId}`, handleOpenEvent);
      window.removeEventListener(`chat-widget-close-${instanceId}`, handleCloseEvent);
      window.removeEventListener(`chat-widget-toggle-${instanceId}`, handleToggleEvent);
    };
  }, [instanceId]);

  return (
    <WidgetStateContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

export const useWidgetState = () => {
  const context = useContext(WidgetStateContext);
  
  if (context === undefined) {
    throw new Error('useWidgetState must be used within a WidgetStateProvider');
  }
  
  return context;
};
