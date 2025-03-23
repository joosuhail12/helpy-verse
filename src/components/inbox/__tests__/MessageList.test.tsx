
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from '../components/MessageList';
import type { Message } from '../types';
import type { Ticket } from '@/types/ticket';
import { stringToCustomer, stringToCompany, stringToTeamMember } from '@/types/ticket';

const mockMessages: Message[] = [
  {
    id: 'msg1',
    content: 'Having issues with the latest update',
    sender: {
      id: 'customer1',
      name: 'Alice Chen',
      type: 'customer'
    },
    text: 'Having issues with the latest update',
    timestamp: '2024-03-15T10:30:00Z',
    isCustomer: true,
    readBy: []
  },
  {
    id: 'msg2',
    content: 'Let me look into that for you right away',
    sender: {
      id: 'agent1',
      name: 'Support Agent',
      type: 'agent'
    },
    text: 'Let me look into that for you right away',
    timestamp: '2024-03-15T10:32:00Z',
    isCustomer: false,
    readBy: ['agent1']
  },
  {
    id: 'msg3',
    content: 'Customer mentioned previous incidents - need to check history',
    sender: {
      id: 'agent1',
      name: 'Support Agent',
      type: 'agent'
    },
    text: 'Customer mentioned previous incidents - need to check history',
    timestamp: '2024-03-15T10:33:00Z',
    isCustomer: false,
    type: 'internal_note',
    readBy: ['agent1']
  }
];

const mockTicket: Ticket = {
  id: 'ticket123',
  subject: 'Issue with Latest Update',
  customer: stringToCustomer('Alice Chen'),
  lastMessage: 'Having issues with the latest update',
  assignee: stringToTeamMember('agent1'),
  company: stringToCompany('TechCorp Ltd'),
  tags: ['bug', 'high-priority'],
  status: 'open',
  priority: 'high',
  createdAt: '2024-03-15T10:30:00Z',
  updatedAt: '2024-03-15T10:30:00Z',
  isUnread: true,
  recipients: ['alice.chen@example.com']
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
