
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { TicketFormProps, TicketFormValues, Recipient, AssigneeOption } from './types';
import type { EmailChannel } from '@/types/emailChannel';
import {
  FormHeader,
  ChannelAssigneeSection,
  PriorityStatusSection,
  MessageSection,
  ValidationWarning,
  FormActions
} from './components';

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

  const resetForm = () => setValues(defaultValues);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <FormHeader 
              subject={values.subject}
              recipients={values.recipients}
              onSubjectChange={handleInputChange}
              onRecipientsChange={handleRecipientChange}
            />
            
            <ChannelAssigneeSection 
              selectedChannel={values.emailChannel}
              setSelectedChannel={handleEmailChannelChange}
              selectedAssignee={values.assignee || { id: '', name: 'Unassigned', type: 'self' }}
              setSelectedAssignee={handleAssigneeChange}
            />
            
            <PriorityStatusSection 
              priority={values.priority}
              status={values.status}
              onPriorityChange={(value) => handleSelectChange('priority', value)}
              onStatusChange={(value) => handleSelectChange('status', value)}
            />
          </div>
          
          <MessageSection 
            message={values.message}
            onMessageChange={handleMessageChange}
          />
          
          {hasValidationErrors() && <ValidationWarning />}
          
          <FormActions 
            onCancel={() => onSubmit(defaultValues, () => setValues(defaultValues))}
            isSubmitting={isSubmitting}
            hasValidationErrors={hasValidationErrors()}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            resetForm={resetForm}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
