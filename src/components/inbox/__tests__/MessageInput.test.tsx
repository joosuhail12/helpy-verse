
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageInput from '../MessageInput';
import { stringToCustomer, stringToCompany, stringToTeamMember } from '@/types/ticket';

const mockTicket = {
  id: 'ticket123',
  subject: 'API Integration Help',
  customer: stringToCustomer('David Lee'),
  lastMessage: 'Need help with API integration',
  assignee: stringToTeamMember('agent2'),
  company: stringToCompany('DevTech Solutions'),
  tags: ['api', 'integration'],
  status: 'open' as const,
  priority: 'high' as const,
  createdAt: '2024-03-15T11:00:00Z',
  updatedAt: '2024-03-15T11:05:00Z',
  isUnread: true,
  recipients: ['david.lee@example.com']
};

describe('MessageInput', () => {
  it('renders in enabled state correctly', () => {
    render(
      <MessageInput
        newMessage=""
        onMessageChange={vi.fn()}
        onKeyPress={vi.fn()}
        onSendMessage={vi.fn()}
        ticket={mockTicket}
        isSending={false}
        disabled={false}
      />
    );

    expect(screen.getByRole('button', { name: /send reply/i })).toBeEnabled();
  });

  it('renders in disabled state correctly', () => {
    render(
      <MessageInput
        newMessage=""
        onMessageChange={vi.fn()}
        onKeyPress={vi.fn()}
        onSendMessage={vi.fn()}
        ticket={mockTicket}
        isSending={false}
        disabled={true}
      />
    );

    expect(screen.getByRole('button', { name: /send reply/i })).toBeDisabled();
  });

  it('renders sending state correctly', () => {
    render(
      <MessageInput
        newMessage=""
        onMessageChange={vi.fn()}
        onKeyPress={vi.fn()}
        onSendMessage={vi.fn()}
        ticket={mockTicket}
        isSending={true}
        disabled={false}
      />
    );

    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('calls onSendMessage when send button is clicked', async () => {
    const onSendMessage = vi.fn();
    render(
      <MessageInput
        newMessage="Test message"
        onMessageChange={vi.fn()}
        onKeyPress={vi.fn()}
        onSendMessage={onSendMessage}
        ticket={mockTicket}
        isSending={false}
        disabled={false}
      />
    );

    const sendButton = screen.getByRole('button', { name: /send reply/i });
    await userEvent.click(sendButton);
    expect(onSendMessage).toHaveBeenCalled();
  });
});
