
import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';

// Define the widget state structure
interface WidgetState {
  isOpen: boolean;
  activeWidget: string | null;
  position: {
    x: number;
    y: number;
  };
  theme: 'light' | 'dark';
  [key: string]: any; // Allow for additional properties
}

// Define the initial state
const initialState: WidgetState = {
  isOpen: false,
  activeWidget: null,
  position: {
    x: 0,
    y: 0,
  },
  theme: 'light',
};

// Define action types
export type WidgetAction = 
  | { type: 'OPEN_WIDGET'; payload: string }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'SET_POSITION'; payload: { x: number; y: number } }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'UPDATE_WIDGET_DATA'; payload: { [key: string]: any } };

// Create the context with typing
interface WidgetContextType {
  state: WidgetState;
  dispatch: Dispatch<WidgetAction>;
}

// Create the context with a default value
const WidgetStateContext = createContext<WidgetContextType | null>(null);

// Create the reducer function
const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'OPEN_WIDGET':
      return {
        ...state,
        isOpen: true,
        activeWidget: action.payload,
      };
    case 'CLOSE_WIDGET':
      return {
        ...state,
        isOpen: false,
        activeWidget: null,
      };
    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'UPDATE_WIDGET_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

// Props for the provider component
interface WidgetStateProviderProps {
  children: ReactNode;
}

// Create the provider component
export const WidgetStateProvider: React.FC<WidgetStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(widgetReducer, initialState);
  
  return (
    <WidgetStateContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

// Custom hook to use the widget context
export const useWidgetState = (): WidgetContextType => {
  const context = useContext(WidgetStateContext);
  
  if (!context) {
    throw new Error('useWidgetState must be used within a WidgetStateProvider');
  }
  
  return context;
};
