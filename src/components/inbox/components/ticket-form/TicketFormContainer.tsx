
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import TicketForm from './TicketForm';
import type { TicketFormValues } from './types';
import type { Ticket } from '@/types/ticket';

interface TicketFormContainerProps {
  onTicketCreated?: (ticket: Ticket) => void;
  onCancel?: () => void;
}

const TicketFormContainer = ({ onTicketCreated, onCancel }: TicketFormContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSubmit = async (values: TicketFormValues, callback: () => void) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new ticket from form values
      const newTicket: Ticket = {
        id: Date.now().toString(),
        subject: values.subject,
        customer: values.recipients.map(r => 
          'firstname' in r ? `${r.firstname} ${r.lastname}` : r.email
        ).join(', '),
        lastMessage: values.message,
        company: values.company,
        assignee: null,
        tags: [],
        status: values.status,
        priority: values.priority,
        createdAt: new Date().toISOString(),
        isUnread: true,
        recipients: values.recipients.map(r => r.id)
      };
      
      // In a real app, you would dispatch an action to add the ticket to your store
      // dispatch(addTicket(newTicket));
      
      toast({
        title: "Ticket created",
        description: `Ticket "${values.subject}" has been created successfully`,
      });
      
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }
      
      callback();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TicketForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default TicketFormContainer;
