
import * as React from 'react';
import TicketForm from './TicketForm';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { TeamMember } from '@/types/ticket';
import type { RootState } from '@/store/store';

const TicketFormContainer = ({ onClose, onTicketCreated }: { onClose: () => void; onTicketCreated?: (ticket: any) => void }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const teams = useAppSelector((state: RootState) => state.teams?.teams || []);
  const emailChannels = useAppSelector((state: RootState) => state.emailChannels?.channels || []);
  
  // Convert team members from teams to TeamMember format
  const assigneeOptions: TeamMember[] = teams.flatMap(team => 
    (team.teamMembers || []).map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      avatar: '',
      teamId: team.id,
      teamName: team.name
    }))
  );

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
      assignees={assigneeOptions}
      emailChannels={emailChannels}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={onClose}
    />
  );
};

export default TicketFormContainer;
