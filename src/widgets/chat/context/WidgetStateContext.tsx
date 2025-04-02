
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types for the widget state
export interface WidgetState {
  instanceId: string;
  theme: {
    position: 'left' | 'right';
    compact: boolean;
    colors?: {
      primary: string;
      [key: string]: string;
    };
  };
  isOpen: boolean;
  isInitialized: boolean;
  config?: {
    workspaceId: string;
    [key: string]: any;
  };
}

// Define action types for state updates
export type WidgetAction =
  | { type: 'INITIALIZE'; payload: any }
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'SET_CONFIG'; payload: any }
  | { type: 'SET_THEME'; payload: any };

// Define context type
interface WidgetStateContextType {
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
}

// Create context
const WidgetStateContext = createContext<WidgetStateContextType | undefined>(undefined);

// Default initial state
const defaultInitialState: WidgetState = {
  instanceId: 'default',
  theme: {
    position: 'right', // Always default to right positioning
    compact: false,
    colors: {
      primary: '#9b87f5',
    },
  },
  isOpen: false,
  isInitialized: false,
};

// Reducer function for state management
const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        config: {
          ...action.payload,
          workspaceId: action.payload.workspaceId || state.config?.workspaceId,
        },
        theme: {
          ...state.theme,
          position: 'right' as const, // Force right positioning with type assertion
          compact: action.payload.theme?.compact ?? state.theme.compact,
          colors: {
            ...state.theme.colors,
            ...(action.payload.theme?.colors || {}),
          },
        },
      };

    case 'TOGGLE_WIDGET':
      const toggledState = { ...state, isOpen: !state.isOpen };
      // Save to localStorage for persistence
      try {
        localStorage.setItem(`chat-widget-state-${state.instanceId}`, JSON.stringify({
          isOpen: toggledState.isOpen,
        }));
      } catch (e) {
        console.error('Failed to save widget state to localStorage', e);
      }
      return toggledState;

    case 'OPEN_WIDGET':
      const openState = { ...state, isOpen: true };
      // Save to localStorage for persistence
      try {
        localStorage.setItem(`chat-widget-state-${state.instanceId}`, JSON.stringify({
          isOpen: true,
        }));
      } catch (e) {
        console.error('Failed to save widget state to localStorage', e);
      }
      return openState;

    case 'CLOSE_WIDGET':
      const closedState = { ...state, isOpen: false };
      // Save to localStorage for persistence
      try {
        localStorage.setItem(`chat-widget-state-${state.instanceId}`, JSON.stringify({
          isOpen: false,
        }));
      } catch (e) {
        console.error('Failed to save widget state to localStorage', e);
      }
      return closedState;

    case 'SET_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          position: 'right' as const, // Always force right positioning with type assertion
          compact: action.payload.compact ?? state.theme.compact,
          colors: {
            ...state.theme.colors,
            ...(action.payload.colors || {}),
          },
        },
      };

    default:
      return state;
  }
};

// Provider component
export const WidgetStateProvider: React.FC<{
  children: React.ReactNode;
  instanceId?: string;
}> = ({ children, instanceId = 'default' }) => {
  // Create initial state with instance ID
  const initialState: WidgetState = {
    ...defaultInitialState,
    instanceId,
    theme: {
      ...defaultInitialState.theme,
      position: 'right', // Ensure right positioning
    },
  };

  // Set up reducer with initial state
  const [state, dispatch] = useReducer(widgetReducer, initialState);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(`chat-widget-state-${instanceId}`);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.isOpen !== undefined) {
          if (parsedState.isOpen) {
            dispatch({ type: 'OPEN_WIDGET' });
          } else {
            dispatch({ type: 'CLOSE_WIDGET' });
          }
        }
      }
    } catch (e) {
      console.error('Failed to load widget state from localStorage', e);
    }

    // Set up event listeners for global widget controls
    const handleOpen = () => dispatch({ type: 'OPEN_WIDGET' });
    const handleClose = () => dispatch({ type: 'CLOSE_WIDGET' });
    const handleToggle = () => dispatch({ type: 'TOGGLE_WIDGET' });

    // Add event listeners with instance-specific names
    window.addEventListener(`chat-widget-open-${instanceId}`, handleOpen);
    window.addEventListener(`chat-widget-close-${instanceId}`, handleClose);
    window.addEventListener(`chat-widget-toggle-${instanceId}`, handleToggle);

    // Cleanup
    return () => {
      window.removeEventListener(`chat-widget-open-${instanceId}`, handleOpen);
      window.removeEventListener(`chat-widget-close-${instanceId}`, handleClose);
      window.removeEventListener(`chat-widget-toggle-${instanceId}`, handleToggle);
    };
  }, [instanceId]);

  // Provide the state and dispatch function to children
  return (
    <WidgetStateContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

// Custom hook for using the widget state
export const useWidgetState = () => {
  const context = useContext(WidgetStateContext);
  if (context === undefined) {
    throw new Error('useWidgetState must be used within a WidgetStateProvider');
  }
  return context;
};
