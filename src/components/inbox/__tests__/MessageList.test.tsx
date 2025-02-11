
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from '../components/MessageList';

const mockMessages = [
  {
    id: '1',
    content: 'Test message 1',
    sender: 'John Doe',
    timestamp: '2024-01-01T00:00:00.000Z',
    isCustomer: true,
    readBy: []
  },
  {
    id: '2',
    content: 'Test message 2',
    sender: 'Agent',
    timestamp: '2024-01-01T00:00:00.000Z',
    isCustomer: false,
    readBy: ['Agent']
  }
];

const mockTicket = {
  id: '123',
  subject: 'Test Subject',
  customer: 'John Doe',
  company: 'Acme Inc',
  lastMessage: 'Initial message',
  assignee: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  status: 'open',
  priority: 'medium',
  tags: []
};

describe('MessageList', () => {
  it('renders loading state correctly', () => {
    render(
      <MessageList
        messages={[]}
        typingUsers={[]}
        ticket={mockTicket}
        onReply={vi.fn()}
        isLoading={true}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    render(
      <MessageList
        messages={mockMessages}
        typingUsers={[]}
        ticket={mockTicket}
        onReply={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText('Test message 1')).toBeInTheDocument();
    expect(screen.getByText('Test message 2')).toBeInTheDocument();
  });

  it('shows typing indicator when users are typing', () => {
    render(
      <MessageList
        messages={mockMessages}
        typingUsers={['Jane Doe']}
        ticket={mockTicket}
        onReply={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText('Jane Doe is typing...')).toBeInTheDocument();
  });
});
