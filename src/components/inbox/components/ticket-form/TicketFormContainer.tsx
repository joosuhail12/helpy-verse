
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addContact } from '@/store/slices/contacts/contactsSlice';
import TicketForm from './TicketForm';
import type { Ticket } from '@/types/ticket';
import type { TicketFormValues } from './types';

interface TicketFormContainerProps {
  onTicketCreated?: (ticket: Ticket) => void;
  onCancel: () => void;
}

const TicketFormContainer = ({ onTicketCreated, onCancel }: TicketFormContainerProps) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TicketFormValues, callback: () => void) => {
    setIsSubmitting(true);
    
    try {
      // Create any new contacts from email entries
      const newContacts = values.recipients.filter(r => 'isNew' in r && r.isNew);
      
      for (const newContact of newContacts) {
        // Add the new contact to the store
        await dispatch(addContact({
          id: newContact.id,
          firstname: '',
          lastname: '',
          email: newContact.email,
          type: 'visitor',
          status: 'active',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })).unwrap();
      }
      
      // Create primary customer name from first recipient for display
      let primaryCustomer = '';
      if (values.recipients.length > 0) {
        const first = values.recipients[0];
        if ('firstname' in first) {
          primaryCustomer = `${first.firstname} ${first.lastname}`;
        } else {
          primaryCustomer = first.email.split('@')[0];
        }
      }
      
      // Create a ticket object
      const newTicket: Ticket = {
        id: uuidv4(),
        subject: values.subject,
        customer: primaryCustomer,
        lastMessage: values.message,
        company: values.company || 'N/A',
        assignee: null,
        tags: [],
        status: values.status,
        priority: values.priority,
        createdAt: new Date().toISOString(),
        isUnread: true,
        recipients: values.recipients.map(r => r.id)
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }
      
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
      
      // Call the callback to reset the form
      callback();
      onCancel();
    } catch (error) {
      console.error("Error creating ticket:", error);
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
