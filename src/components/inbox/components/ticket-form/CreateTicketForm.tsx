
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import EmailChannelSelect from './EmailChannelSelect';
import AssigneeSelect from './AssigneeSelect';
import TagsInput from './TagsInput';
import RecipientsInput from './RecipientsInput';
import { mockEmailChannels } from '@/mock/emailChannels';
import { AssigneeOption } from './types';

const ticketSchema = z.object({
  subject: z.string().min(3, 'Subject must have at least 3 characters'),
  customer: z.string().min(1, 'Customer name is required'),
  company: z.string().optional(),
  description: z.string().min(10, 'Description must have at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.string()).optional(),
  recipients: z.array(z.string()).min(1, 'At least one recipient email is required'),
  assignee: z.string().optional().nullable(),
  emailChannel: z.string().min(1, 'Email channel is required'),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;

interface CreateTicketFormProps {
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const CreateTicketForm = ({ onSubmit, isSubmitting, onCancel }: CreateTicketFormProps) => {
  const [selectedEmailChannel, setSelectedEmailChannel] = useState<any>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<AssigneeOption | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      customer: '',
      company: '',
      description: '',
      priority: 'medium',
      tags: [],
      recipients: [],
      assignee: null,
      emailChannel: '',
    },
  });

  const handleSubmit = (values: TicketFormValues) => {
    // Add tags and selected values
    const formData = {
      ...values,
      tags,
      assignee: selectedAssignee?.name || null,
      emailChannel: selectedEmailChannel?.id || '',
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter ticket subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Email Channel <span className="text-red-500">*</span></FormLabel>
            <EmailChannelSelect
              channels={mockEmailChannels}
              selectedChannel={selectedEmailChannel}
              onSelectChannel={setSelectedEmailChannel}
            />
            {form.formState.errors.emailChannel && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.emailChannel.message}</p>
            )}
          </div>
          
          <div>
            <FormLabel>Assignee</FormLabel>
            <AssigneeSelect
              selectedAssignee={selectedAssignee}
              onSelectAssignee={setSelectedAssignee}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="recipients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipients <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <RecipientsInput
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagsInput
                  tags={tags}
                  onChange={setTags}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter ticket description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTicketForm;
