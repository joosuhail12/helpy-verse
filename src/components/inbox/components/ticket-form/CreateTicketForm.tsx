
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import TagInput from './TagInput';
import RecipientInput from './RecipientInput';

const CreateTicketForm = () => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input placeholder="Enter ticket subject" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>Customer Name</FormLabel>
          <Input 
            placeholder="Customer name" 
            {...form.register("customerName")} 
          />
          <FormMessage>{form.formState.errors.customerName?.message}</FormMessage>
        </FormItem>
        
        <FormItem>
          <FormLabel>Company</FormLabel>
          <Input 
            placeholder="Company name" 
            {...form.register("companyName")} 
          />
          <FormMessage>{form.formState.errors.companyName?.message}</FormMessage>
        </FormItem>
      </div>
      
      <FormItem>
        <FormLabel>Description</FormLabel>
        <Textarea 
          placeholder="Ticket description" 
          className="min-h-[120px]" 
          {...form.register("messageContent")}
        />
        <FormMessage>{form.formState.errors.messageContent?.message}</FormMessage>
      </FormItem>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee (Optional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                  <SelectItem value="Mike Thompson">Mike Thompson</SelectItem>
                  <SelectItem value="Tom Wilson">Tom Wilson</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="ticketTags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <TagInput 
                value={field.value || []} 
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Press Enter to add tags
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recipients"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipients</FormLabel>
            <FormControl>
              <RecipientInput 
                value={field.value || ['']} 
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Add recipient email addresses
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CreateTicketForm;
