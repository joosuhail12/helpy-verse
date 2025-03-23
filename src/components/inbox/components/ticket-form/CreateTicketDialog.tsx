
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateTicketForm from './CreateTicketForm';
import type { Ticket } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';
import { stringToCustomer, stringToCompany, stringToTeamMember } from '@/types/ticket';

interface CreateTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

const CreateTicketDialog = ({ 
  isOpen, 
  onClose, 
  onTicketCreated 
}: CreateTicketDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new ticket with generated ID
      const newTicket: Ticket = {
        id: Math.random().toString(36).substring(2, 10),
        subject: values.subject,
        customer: stringToCustomer(values.customer || 'Anonymous'),
        company: stringToCompany(values.company || 'Unknown Company'),
        assignee: values.assignee ? stringToTeamMember(values.assignee) : null,
        status: 'open',
        priority: values.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: values.tags || [],
        lastMessage: values.description || '',
        isUnread: true,
        recipients: values.recipients || []
      };
      
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }
      
      toast({
        title: "Ticket created",
        description: `Ticket #${newTicket.id} has been created successfully.`,
      });

      onClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Create a new support ticket for customer inquiry or issue.
          </DialogDescription>
        </DialogHeader>
        
        <CreateTicketForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
