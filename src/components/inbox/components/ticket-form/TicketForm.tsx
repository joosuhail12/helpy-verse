
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, AlertTriangle } from "lucide-react";

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

  const hasValidationErrors = () => {
    return !values.subject || 
           values.recipients.length === 0 || 
           !values.message || 
           !values.emailChannel;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-muted/40 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Mail className="h-5 w-5 text-primary" />
          Create New Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="font-medium">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                value={values.subject}
                onChange={handleInputChange}
                placeholder="Enter ticket subject"
                className="transition-all focus-visible:ring-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to" className="font-medium">
                To <span className="text-red-500">*</span>
              </Label>
              <ToField 
                selectedRecipients={values.recipients}
                onChange={handleRecipientChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmailChannelSelect 
                value={values.emailChannel}
                onChange={handleEmailChannelChange}
              />
              
              <AssigneeSelect 
                value={values.assignee}
                onChange={handleAssigneeChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="font-medium">
                  Priority
                </Label>
                <Select 
                  value={values.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => handleSelectChange('priority', value)}
                >
                  <SelectTrigger id="priority" className="transition-all focus-visible:ring-primary">
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
                <Label htmlFor="status" className="font-medium">
                  Status
                </Label>
                <Select 
                  value={values.status} 
                  onValueChange={(value: 'open' | 'pending' | 'closed') => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status" className="transition-all focus-visible:ring-primary">
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
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="message" className="font-medium block">
                Initial Message <span className="text-red-500">*</span>
              </Label>
              <div className="bg-white rounded-lg border">
                <TicketMessageEditor 
                  content={values.message}
                  onChange={handleMessageChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <span className="text-muted-foreground/80">
                  Type @ to mention customer, company, or ticket information.
                </span>
              </p>
            </div>
          </div>
          
          {hasValidationErrors() && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-md p-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Please complete all required fields before submitting</span>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSubmit(defaultValues, () => setValues(defaultValues))}
              disabled={isSubmitting}
              className="transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || hasValidationErrors()} 
              className="transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
