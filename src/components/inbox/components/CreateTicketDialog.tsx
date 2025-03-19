
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import ToField from './ToField';
import type { Ticket } from '@/types/ticket';
import type { Contact } from '@/types/contact';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addContact } from '@/store/slices/contacts/contactsSlice';

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

type Recipient = Contact | { id: string; email: string; isNew?: boolean };

const CreateTicketDialog = ({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'open' | 'pending' | 'closed'>('open');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || recipients.length === 0 || !message) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create any new contacts from email entries
      const newContacts = recipients.filter(r => 'isNew' in r && r.isNew);
      
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
      if (recipients.length > 0) {
        const first = recipients[0];
        if ('firstname' in first) {
          primaryCustomer = `${first.firstname} ${first.lastname}`;
        } else {
          primaryCustomer = first.email.split('@')[0];
        }
      }
      
      // Here you would normally submit to your backend
      // For now, we'll create a ticket object locally
      const newTicket: Ticket = {
        id: uuidv4(),
        subject,
        customer: primaryCustomer,
        lastMessage: message,
        company: company || 'N/A',
        assignee: null,
        tags: [],
        status,
        priority,
        createdAt: new Date().toISOString(),
        isUnread: true,
        // Would normally include recipient IDs on the ticket
        recipients: recipients.map(r => r.id)
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
      
      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
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

  const resetForm = () => {
    setSubject('');
    setRecipients([]);
    setMessage('');
    setCompany('');
    setPriority('medium');
    setStatus('open');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-right">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter ticket subject"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="to" className="text-right">
              To <span className="text-red-500">*</span>
            </Label>
            <ToField 
              selectedRecipients={recipients}
              onChange={setRecipients}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name (optional)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={(value: 'open' | 'pending' | 'closed') => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-right">
              Initial Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the initial message for this ticket"
              rows={4}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
