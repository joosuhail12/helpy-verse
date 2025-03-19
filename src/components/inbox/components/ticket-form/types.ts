
import type { Ticket } from '@/types/ticket';
import type { Contact } from '@/types/contact';

export type Recipient = Contact | { id: string; email: string; isNew?: boolean };

export type TicketFormValues = {
  subject: string;
  recipients: Recipient[];
  company: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'pending' | 'closed';
  message: string;
};

export interface TicketFormProps {
  onSubmit: (values: TicketFormValues, callback: () => void) => void;
  initialValues?: Partial<TicketFormValues>;
  isSubmitting?: boolean;
}

export interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: (ticket: Ticket) => void;
}
