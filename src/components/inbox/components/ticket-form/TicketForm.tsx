import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToField } from '../to-field';
import AssigneeSelect from './AssigneeSelect';
import EmailChannelSelect from './EmailChannelSelect';
import TicketMessageEditor from './TicketMessageEditor';
import type { TicketFormProps, TicketFormValues, Recipient, AssigneeOption } from './types';
import type { EmailChannel } from '@/types/emailChannel';

const defaultValues: TicketFormValues = {
  subject: '',
  recipients: [],
  priority: 'medium',
  status: 'open',
  message: '',
  assignee: null,
  emailChannel: null,
};

const TicketForm = ({ onSubmit, initialValues = {}, isSubmitting = false }: TicketFormProps) => {
  const { toast } = useToast();
  const [values, setValues] = useState<TicketFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const handleRecipientChange = (recipients: Recipient[]) => {
    setValues(prev => ({ ...prev, recipients }));
  };

  const handleAssigneeChange = (assignee: AssigneeOption | null) => {
    setValues(prev => ({ ...prev, assignee }));
  };
  
  const handleEmailChannelChange = (emailChannel: EmailChannel | null) => {
    setValues(prev => ({ ...prev, emailChannel }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleMessageChange = (message: string) => {
    setValues(prev => ({ ...prev, message }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!values.subject || values.recipients.length === 0 || !values.message) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.emailChannel) {
      toast({
        title: "Validation Error",
        description: "Please select an email channel for the outbound ticket",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(values, () => {
      // Reset form after successful submission
      setValues(defaultValues);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-right">
          Subject <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          value={values.subject}
          onChange={handleInputChange}
          placeholder="Enter ticket subject"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to" className="text-right">
          To <span className="text-red-500">*</span>
        </Label>
        <ToField 
          selectedRecipients={values.recipients}
          onChange={handleRecipientChange}
        />
      </div>
      
      <EmailChannelSelect 
        value={values.emailChannel}
        onChange={handleEmailChannelChange}
      />
      
      <AssigneeSelect 
        value={values.assignee}
        onChange={handleAssigneeChange}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-right">
            Priority
          </Label>
          <Select 
            value={values.priority} 
            onValueChange={(value: 'low' | 'medium' | 'high') => handleSelectChange('priority', value)}
          >
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
          <Select 
            value={values.status} 
            onValueChange={(value: 'open' | 'pending' | 'closed') => handleSelectChange('status', value)}
          >
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
      
      <div className="space-y-2 border p-4 rounded-md bg-white">
        <Label htmlFor="message" className="text-right block mb-2 font-medium">
          Initial Message <span className="text-red-500">*</span>
        </Label>
        <div className="bg-white rounded-lg">
          <TicketMessageEditor 
            content={values.message}
            onChange={handleMessageChange}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Type @ to mention customer, company, or ticket information. Use formatting tools for better readability.
        </p>
      </div>
      
      <div className="pt-4 flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSubmit(defaultValues, () => setValues(defaultValues))}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
