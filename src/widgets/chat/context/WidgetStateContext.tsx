
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ThemeConfig, ChatWidgetSettings } from '../types';

// Define the state shape
interface WidgetState {
  isOpen: boolean;
  isInitialized: boolean;
  workspaceId?: string;
  theme: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
}

// Define the action types
type WidgetAction = 
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'INITIALIZE'; payload: { workspaceId: string; theme: Partial<ThemeConfig>; settings?: Partial<ChatWidgetSettings> } };

// Define the context shape
interface WidgetStateContextType {
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
}

// Create the context
const WidgetStateContext = createContext<WidgetStateContextType | undefined>(undefined);

// Define the initial state
const initialState: WidgetState = {
  isOpen: false,
  isInitialized: false,
  theme: {},
};

// Define the reducer
const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'TOGGLE_WIDGET':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'OPEN_WIDGET':
      return {
        ...state,
        isOpen: true,
      };
    case 'CLOSE_WIDGET':
      return {
        ...state,
        isOpen: false,
      };
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        workspaceId: action.payload.workspaceId,
        theme: {
          ...state.theme,
          ...action.payload.theme,
        },
        settings: action.payload.settings,
      };
    default:
      return state;
  }
};

// Create the provider
export const WidgetStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(widgetReducer, initialState);

  return (
    <WidgetStateContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

// Create a hook to use the context
export const useWidgetState = (): WidgetStateContextType => {
  const context = useContext(WidgetStateContext);
  if (context === undefined) {
    throw new Error('useWidgetState must be used within a WidgetStateProvider');
  }
  return context;
};
