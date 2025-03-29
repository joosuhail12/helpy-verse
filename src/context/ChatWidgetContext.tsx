
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { ChatWidgetConfig, ChatMessage, FileAttachment } from '@/api/chat-widget/types';

// Define the state structure
interface ChatWidgetState {
  isOpen: boolean;
  isInitialized: boolean;
  config: ChatWidgetConfig | null;
  messages: ChatMessage[];
  attachments: FileAttachment[];
  theme: {
    colors: {
      primary: string;
      background?: string;
      foreground?: string;
      userMessage?: string;
      agentMessage?: string;
    };
    position: 'left' | 'right';
    compact: boolean;
  };
}

// Define action types
type ActionType = 
  | { type: 'INITIALIZE'; payload: ChatWidgetConfig }
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_ATTACHMENT'; payload: FileAttachment }
  | { type: 'REMOVE_ATTACHMENT'; payload: string }
  | { type: 'CLEAR_ATTACHMENTS' }
  | { type: 'UPDATE_THEME'; payload: Partial<ChatWidgetState['theme']> };

// Initial state
const initialState: ChatWidgetState = {
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
const chatWidgetReducer = (state: ChatWidgetState, action: ActionType): ChatWidgetState => {
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
interface ChatWidgetContextType {
  state: ChatWidgetState;
  dispatch: Dispatch<ActionType>;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

// Create the provider component
export const ChatWidgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatWidgetReducer, initialState);
  
  return (
    <ChatWidgetContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatWidgetContext.Provider>
  );
};

// Create a custom hook to use the context
export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  if (context === undefined) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
};

export default ChatWidgetContext;
