
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversationPanel from '../ConversationPanel';
import { useConversation } from '../hooks/useConversation';

// Mock the useConversation hook
vi.mock('../hooks/useConversation', () => ({
  useConversation: vi.fn()
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockTicket = {
  id: 'ticket123',
  subject: 'Performance Optimization Request',
  customer: 'Michael Chang',
  lastMessage: 'System is running slow after latest deployment',
  assignee: 'agent3',
  company: 'OptimizeTech Inc',
  tags: ['performance', 'urgent'],
  status: 'open' as const,
  priority: 'high' as const,
  createdAt: '2024-03-15T12:00:00Z',
  updatedAt: '2024-03-15T12:05:00Z',
  isUnread: true,
  categories: ['technical', 'performance']
};

describe('ConversationPanel', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementation
    (useConversation as any).mockReturnValue({
      messages: [],
      newMessage: '',
      setNewMessage: vi.fn(),
      typingUsers: [],
      activeUsers: [],
      handleSendMessage: vi.fn(),
      handleTyping: vi.fn(),
      isLoading: false,
      error: null,
      isSending: false
    });
  });

  it('renders loading state correctly', () => {
    (useConversation as any).mockReturnValue({
      isLoading: true,
      messages: [],
      typingUsers: [],
      activeUsers: []
    });

    render(<ConversationPanel ticket={mockTicket} onClose={vi.fn()} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load conversation';
    (useConversation as any).mockReturnValue({
      error: errorMessage,
      messages: [],
      typingUsers: [],
      activeUsers: []
    });

    render(<ConversationPanel ticket={mockTicket} onClose={vi.fn()} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles message sending correctly', async () => {
    const handleSendMessage = vi.fn();
    (useConversation as any).mockReturnValue({
      messages: [],
      newMessage: 'Test message',
      setNewMessage: vi.fn(),
      typingUsers: [],
      activeUsers: [],
      handleSendMessage,
      isLoading: false,
      error: null
    });

    render(<ConversationPanel ticket={mockTicket} onClose={vi.fn()} />);
    
    const sendButton = screen.getByText('Send Reply');
    await userEvent.click(sendButton);
    
    expect(handleSendMessage).toHaveBeenCalled();
  });
});
