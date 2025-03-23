
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageToolbar from '../components/MessageToolbar';

const mockTicket = {
  id: 'ticket123',
  subject: 'Feature Request: Mobile App',
  customer: 'Sarah Johnson',
  lastMessage: 'Would love to see this in the mobile app',
  assignee: 'agent1',
  company: 'MobileFirst Solutions',
  tags: ['feature-request', 'mobile'],
  status: 'open' as const,
  priority: 'medium' as const,
  createdAt: '2024-03-15T09:00:00Z',
  updatedAt: '2024-03-15T09:05:00Z',
  isUnread: false,
  categories: ['product', 'mobile'],
  recipients: ['sarah.johnson@example.com'] // Added recipients array
};

describe('MessageToolbar', () => {
  const defaultProps = {
    editor: null,
    onInsertPlaceholder: vi.fn(),
    ticket: mockTicket,
    disabled: false,
    isInternalNote: false,
    setIsInternalNote: vi.fn(),
    onEmojiSelect: vi.fn(),
    onFilesAdded: vi.fn(),
    uploadProgress: {},
    onRemoveFile: vi.fn(),
    files: [],
    isAttachmentSheetOpen: false,
    setIsAttachmentSheetOpen: vi.fn(),
  };

  it('renders all formatting buttons', () => {
    render(<MessageToolbar {...defaultProps} />);

    expect(screen.getByTitle('Mention customer')).toBeInTheDocument();
    expect(screen.getByTitle('Mention company')).toBeInTheDocument();
    expect(screen.getByTitle('Reference ticket')).toBeInTheDocument();
  });

  it('disables all buttons when disabled prop is true', () => {
    render(<MessageToolbar {...defaultProps} disabled={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('calls onInsertPlaceholder with correct type when buttons are clicked', async () => {
    const onInsertPlaceholder = vi.fn();
    render(
      <MessageToolbar 
        {...defaultProps}
        onInsertPlaceholder={onInsertPlaceholder}
      />
    );

    await userEvent.click(screen.getByTitle('Mention customer'));
    expect(onInsertPlaceholder).toHaveBeenCalledWith('customer');

    await userEvent.click(screen.getByTitle('Mention company'));
    expect(onInsertPlaceholder).toHaveBeenCalledWith('company');

    await userEvent.click(screen.getByTitle('Reference ticket'));
    expect(onInsertPlaceholder).toHaveBeenCalledWith('ticket');
  });
});
