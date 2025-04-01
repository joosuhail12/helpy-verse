
import React, { createContext, useContext, useReducer } from 'react';
import { ThemeConfig } from './ThemeContext';

interface ChatWidgetState {
  isOpen: boolean;
  config: {
    workspaceId: string;
  };
  theme: {
    position: 'left' | 'right';
    compact: boolean;
    colors: {
      primary: string;
    };
  };
}

type Action = 
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'SET_THEME'; payload: Partial<ThemeConfig> };

interface ChatWidgetContextValue {
  state: ChatWidgetState;
  dispatch: React.Dispatch<Action>;
}

const initialState: ChatWidgetState = {
  isOpen: false,
  config: {
    workspaceId: '',
  },
  theme: {
    position: 'right',
    compact: false,
    colors: {
      primary: '#9b87f5'
    }
  }
};

const ChatWidgetContext = createContext<ChatWidgetContextValue | undefined>(undefined);

const reducer = (state: ChatWidgetState, action: Action): ChatWidgetState => {
  switch (action.type) {
    case 'OPEN_WIDGET':
      return { ...state, isOpen: true };
    case 'CLOSE_WIDGET':
      return { ...state, isOpen: false };
    case 'TOGGLE_WIDGET':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_THEME':
      return { 
        ...state, 
        theme: { 
          ...state.theme, 
          ...(action.payload as any) 
        } 
      };
    default:
      return state;
  }
};

interface ChatWidgetProviderProps {
  children: React.ReactNode;
  initialState?: Partial<ChatWidgetState>;
}

export const ChatWidgetProvider: React.FC<ChatWidgetProviderProps> = ({ 
  children, 
  initialState: propInitialState 
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...propInitialState
  });
  
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
