
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
import { Card, CardContent } from "@/components/ui/card";
import { Mail, AlertTriangle, Clock, Tag, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary/80" />
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                value={values.subject}
                onChange={handleInputChange}
                placeholder="Enter ticket subject"
                className="transition-colors border-gray-200 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/40 rounded-lg"
                required
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="to" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MailCheck className="h-3.5 w-3.5 text-primary/80" />
                To <span className="text-red-500">*</span>
              </Label>
              <ToField 
                selectedRecipients={values.recipients}
                onChange={handleRecipientChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="emailChannel" className="text-sm font-medium text-gray-700">
                  Email Channel <span className="text-red-500">*</span>
                </Label>
                <EmailChannelSelect 
                  value={values.emailChannel}
                  onChange={handleEmailChannelChange}
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="assignee" className="text-sm font-medium text-gray-700">
                  Assignee
                </Label>
                <AssigneeSelect 
                  value={values.assignee}
                  onChange={handleAssigneeChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary/80" />
                  Priority
                </Label>
                <Select 
                  value={values.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => handleSelectChange('priority', value)}
                >
                  <SelectTrigger 
                    id="priority" 
                    className={cn(
                      "transition-colors border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-lg",
                      values.priority === 'high' ? "text-red-600" : 
                      values.priority === 'medium' ? "text-amber-600" : 
                      "text-green-600"
                    )}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-green-600">Low</SelectItem>
                    <SelectItem value="medium" className="text-amber-600">Medium</SelectItem>
                    <SelectItem value="high" className="text-red-600">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary/80" />
                  Status
                </Label>
                <Select 
                  value={values.status} 
                  onValueChange={(value: 'open' | 'pending' | 'closed') => handleSelectChange('status', value)}
                >
                  <SelectTrigger 
                    id="status" 
                    className="transition-colors border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-lg"
                  >
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
          
          <div className="border-t border-gray-100 pt-5 mt-5">
            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                Initial Message <span className="text-red-500">*</span>
              </Label>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <TicketMessageEditor 
                  content={values.message}
                  onChange={handleMessageChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                <span className="text-muted-foreground/80">
                  Type @ to mention customer, company, or ticket information.
                </span>
              </p>
            </div>
          </div>
          
          {hasValidationErrors() && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2 border border-red-100">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>Please complete all required fields before submitting</span>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSubmit(defaultValues, () => setValues(defaultValues))}
              disabled={isSubmitting}
              className="transition-all border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || hasValidationErrors()} 
              className="transition-all shadow-sm hover:shadow"
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
