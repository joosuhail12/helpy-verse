
import React, { createContext, useContext, useReducer } from 'react';
import { ThemeConfig } from './ThemeContext';

interface ChatWidgetState {
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

type ChatWidgetAction = 
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'INITIALIZE'; payload: any }
  | { type: 'SET_THEME'; payload: Partial<ThemeConfig> };

interface ChatWidgetContextType {
  state: ChatWidgetState;
  dispatch: React.Dispatch<ChatWidgetAction>;
}

const initialState: ChatWidgetState = {
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

export const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

const chatWidgetReducer = (state: ChatWidgetState, action: ChatWidgetAction): ChatWidgetState => {
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

export const ChatWidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatWidgetReducer, initialState);
  
  return (
    <ChatWidgetContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatWidgetContext.Provider>
  );
};

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  
  if (context === undefined) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  
  return context;
};
