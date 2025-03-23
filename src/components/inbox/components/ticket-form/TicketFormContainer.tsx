
import { useState } from 'react';
import TicketForm from './TicketForm';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { TeamMember } from '@/types/ticket';

// Mock data until we have actual state
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: '',
    teamId: 'team1',
    teamName: 'Support Team'
  },
  {
    id: '2',
    name: 'Mike Thompson',
    email: 'mike@example.com',
    avatar: '',
    teamId: 'team1',
    teamName: 'Support Team'
  },
  {
    id: '3',
    name: 'Tom Wilson',
    email: 'tom@example.com',
    avatar: '',
    teamId: 'team2',
    teamName: 'Technical Team'
  },
];

const mockEmailChannels = [
  {
    id: '1',
    name: 'Support',
    email: 'support@example.com',
    isVerified: true
  },
  {
    id: '2',
    name: 'Sales',
    email: 'sales@example.com',
    isVerified: true
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
