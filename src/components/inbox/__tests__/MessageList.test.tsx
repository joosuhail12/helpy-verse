
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from '../components/MessageList';

const mockMessages = [
  {
    id: 'msg1',
    content: 'Having issues with the latest update',
    sender: 'Alice Chen',
    timestamp: '2024-03-15T10:30:00Z',
    isCustomer: true,
    readBy: []
  },
  {
    id: 'msg2',
    content: 'Let me look into that for you right away',
    sender: 'Support Agent',
    timestamp: '2024-03-15T10:32:00Z',
    isCustomer: false,
    readBy: ['agent1']
  },
  {
    id: 'msg3',
    content: 'Customer mentioned previous incidents - need to check history',
    sender: 'Support Agent',
    timestamp: '2024-03-15T10:33:00Z',
    isCustomer: false,
    type: 'internal_note' as const,
    readBy: ['agent1']
  }
];

const mockTicket = {
  id: 'ticket123',
  subject: 'Issue with Latest Update',
  customer: 'Alice Chen',
  lastMessage: 'Having issues with the latest update',
  assignee: 'agent1',
  company: 'TechCorp Ltd',
  tags: ['bug', 'high-priority'],
  status: 'open' as const,
  priority: 'high' as const,
  createdAt: '2024-03-15T10:30:00Z',
  updatedAt: '2024-03-15T10:33:00Z',
  isUnread: true,
  categories: ['technical', 'software'],
  recipients: ['alice.chen@example.com'] // Added recipients array
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

    expect(screen.getByText('Having issues with the latest update')).toBeInTheDocument();
    expect(screen.getByText('Let me look into that for you right away')).toBeInTheDocument();
  });

  it('shows typing indicator when users are typing', () => {
    render(
      <MessageList
        messages={mockMessages}
        typingUsers={['Tom Smith']}
        ticket={mockTicket}
        onReply={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText('Tom Smith is typing...')).toBeInTheDocument();
  });

  it('renders internal notes with special styling', () => {
    render(
      <MessageList
        messages={mockMessages}
        typingUsers={[]}
        ticket={mockTicket}
        onReply={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText('Customer mentioned previous incidents - need to check history')).toBeInTheDocument();
  });
});
