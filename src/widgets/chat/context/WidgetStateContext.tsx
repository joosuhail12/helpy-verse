
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { WidgetOptions, WidgetState } from '../types/widget';

// Define action types
type ActionType = 
  | { type: 'INITIALIZE'; payload: WidgetOptions }
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'ADD_MESSAGE'; payload: any }
  | { type: 'SET_MESSAGES'; payload: any[] }
  | { type: 'ADD_ATTACHMENT'; payload: any }
  | { type: 'REMOVE_ATTACHMENT'; payload: string }
  | { type: 'CLEAR_ATTACHMENTS' }
  | { type: 'UPDATE_THEME'; payload: Partial<WidgetState['theme']> };

// Initial state
const initialState: WidgetState = {
  isOpen: false,
  isInitialized: false,
  config: null,
  messages: [],
  attachments: [],
  theme: {
    colors: {
      primary: '#9b87f5',
      background: '#ffffff',
      foreground: '#1f2937',
      userMessage: '#f3f4f6',
      agentMessage: '#9b87f5'
    },
    position: 'right',
    compact: false
  }
};

// Create the reducer
const widgetStateReducer = (state: WidgetState, action: ActionType): WidgetState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        config: action.payload,
        // Apply theme from config if provided
        theme: action.payload.theme ? {
          ...state.theme,
          ...(action.payload.theme.colors && { colors: { ...state.theme.colors, ...action.payload.theme.colors } }),
          position: action.payload.theme.position || state.theme.position,
          compact: action.payload.theme.compact !== undefined ? action.payload.theme.compact : state.theme.compact
        } : state.theme
      };
    
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
      
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
      
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
      
    case 'ADD_ATTACHMENT':
      return {
        ...state,
        attachments: [...state.attachments, action.payload]
      };
      
    case 'REMOVE_ATTACHMENT':
      return {
        ...state,
        attachments: state.attachments.filter(att => att.id !== action.payload)
      };
      
    case 'CLEAR_ATTACHMENTS':
      return {
        ...state,
        attachments: []
      };
      
    case 'UPDATE_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          ...action.payload,
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

// Create the context
interface WidgetStateContextType {
  state: WidgetState;
  dispatch: Dispatch<ActionType>;
}

const WidgetStateContext = createContext<WidgetStateContextType | undefined>(undefined);

// Create the provider component with a unique ID to ensure isolation
export const WidgetStateProvider: React.FC<{ children: ReactNode; id?: string }> = ({ 
  children, 
  id = 'default' 
}) => {
  // Using ID in naming to allow for multiple isolated instances
  const [state, dispatch] = useReducer(
    widgetStateReducer, 
    initialState, 
    (initial) => ({
      ...initial,
      instanceId: id // Add instance ID to track this specific widget instance
    })
  );
  
  return (
    <WidgetStateContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

// Create a custom hook to use the context
export const useWidgetState = () => {
  const context = useContext(WidgetStateContext);
  if (context === undefined) {
    throw new Error('useWidgetState must be used within a WidgetStateProvider');
  }
  return context;
};

export default WidgetStateContext;
