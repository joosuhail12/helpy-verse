
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CreateTicketForm from './CreateTicketForm';
import type { Ticket } from '@/types/ticket';

const ticketFormSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  customer: z.string().min(2, 'Customer name is required'),
  company: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.string()).optional(),
  recipients: z.array(z.string().email()).min(1, 'At least one recipient email is required'),
  assignee: z.string().nullable().optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: (ticket: Ticket) => void;
}

export const CreateTicketDialog = ({ 
  open, 
  onOpenChange, 
  onTicketCreated 
}: CreateTicketDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      subject: '',
      customer: '',
      company: '',
      description: '',
      priority: 'medium',
      tags: [],
      recipients: [''],
      assignee: null,
    },
  });

  const onSubmit = async (values: TicketFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new ticket with generated ID
      const newTicket: Ticket = {
        id: Math.random().toString(36).substring(2, 10),
        subject: values.subject,
        customer: values.customer,
        lastMessage: values.description,
        assignee: values.assignee,
        company: values.company,
        tags: values.tags || [],
        status: 'open',
        priority: values.priority,
        createdAt: new Date().toISOString(),
        isUnread: true,
        recipients: values.recipients
      };
      
      onTicketCreated(newTicket);
      form.reset();
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Create a new support ticket for customer inquiry or issue.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CreateTicketForm form={form} />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
