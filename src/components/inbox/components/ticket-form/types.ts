
import type { Ticket } from '@/types/ticket';
import type { Contact } from '@/types/contact';
import type { EmailChannel } from '@/types/emailChannel';

export type Recipient = Contact | { id: string; email: string; isNew?: boolean };

export type AssigneeType = 'self' | 'team' | 'teammate';

export type AssigneeOption = {
  id: string;
  name: string;
  type: AssigneeType;
};

export type TicketFormValues = {
  subject: string;
  recipients: Recipient[];
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'pending' | 'closed';
  message: string;
  assignee: AssigneeOption | null;
  emailChannel: EmailChannel | null;
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
