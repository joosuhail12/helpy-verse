
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ThemeConfig } from '@/context/ThemeContext';

// Define the widget state
interface WidgetState {
  isOpen: boolean;
  isInitialized: boolean;
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
  | { type: 'INITIALIZE'; payload: { workspaceId: string; theme?: Partial<ThemeConfig>; settings?: any } }
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
  theme: {
    position: 'right',
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
        config: {
          workspaceId: action.payload.workspaceId,
          ...state.config
        },
        theme: {
          ...state.theme,
          position: action.payload.theme?.position || state.theme.position,
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
          position: action.payload.position || state.theme.position,
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
export const WidgetStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(widgetReducer, initialState);
  
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
