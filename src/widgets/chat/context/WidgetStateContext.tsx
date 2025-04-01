
import React, { createContext, useContext, useReducer } from 'react';
import { ThemeConfig } from '@/context/ThemeContext';

interface WidgetState {
  isOpen: boolean;
  isInitialized: boolean;
  config?: {
    workspaceId: string;
  };
  theme: {
    position: 'left' | 'right';
    compact: boolean;
    colors: Partial<ThemeConfig['colors']>;
  };
}

type WidgetAction = 
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'INITIALIZE'; payload: any }
  | { type: 'SET_THEME'; payload: Partial<ThemeConfig> };

interface WidgetStateContextType {
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
}

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

const WidgetStateContext = createContext<WidgetStateContextType | undefined>(undefined);

const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
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
          ...state.config,
          workspaceId: action.payload.workspaceId
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
};

export const WidgetStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(widgetReducer, initialState);
  
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
