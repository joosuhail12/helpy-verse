
import { useState } from 'react';
import TicketForm from './TicketForm';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { TeamMember } from '@/types/ticket';
import type { EmailChannel } from '@/types/emailChannel';

// Mock data until we have actual state
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: ''
  },
  {
    id: '2',
    name: 'Mike Thompson',
    email: 'mike@example.com',
    avatar: ''
  },
  {
    id: '3',
    name: 'Tom Wilson',
    email: 'tom@example.com',
    avatar: ''
  },
];

const mockEmailChannels: EmailChannel[] = [
  {
    id: '1',
    channelName: 'Support',
    senderName: 'Support Team',
    email: 'support@example.com',
    type: 'both',
    createdAt: new Date().toISOString(),
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: false,
    isActive: true,
    isVerified: true,
    name: 'Support'
  },
  {
    id: '2',
    channelName: 'Sales',
    senderName: 'Sales Team',
    email: 'sales@example.com',
    type: 'both',
    createdAt: new Date().toISOString(),
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: false,
    isActive: true,
    isVerified: true,
    name: 'Sales'
  }
];

const TicketFormContainer = ({ onClose, onTicketCreated }: { onClose: () => void; onTicketCreated?: (ticket: any) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, these would come from Redux
  // const teams = useAppSelector(state => state.teams.teams);
  // const emailChannels = useAppSelector(state => state.emailChannels.channels);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Submitted ticket data:', data);
    setIsSubmitting(false);
    if (onTicketCreated) {
      onTicketCreated(data);
    }
    onClose();
  };

  return (
    <TicketForm
      assignees={mockTeamMembers}
      emailChannels={mockEmailChannels}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={onClose}
    />
  );
};

export default TicketFormContainer;
