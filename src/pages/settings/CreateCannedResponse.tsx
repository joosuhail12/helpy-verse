
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CannedResponse } from '@/mock/cannedResponses';
import { CategoryCombobox } from '@/components/settings/cannedResponses/CategoryCombobox';
import { CannedResponseEditor } from '@/components/settings/cannedResponses/CannedResponseEditor';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createCannedResponse } from '@/store/slices/cannedResponses/actions';

interface CannedResponseFormValues {
  title: string;
  content: string;
  shortcut: string;
  category: string;
  isShared: boolean;
  createdBy: string;
}

const CreateCannedResponse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<CannedResponseFormValues>({
    defaultValues: {
      title: '',
      content: '',
      shortcut: '',
      category: '',
      isShared: false,
      createdBy: 'Current User', // Adding default value for createdBy
    },
  });

  const onSubmit = async (data: CannedResponseFormValues) => {
    try {
      await dispatch(createCannedResponse(data)).unwrap();
      toast({
        title: "Success",
        description: "Canned response created successfully",
      });
      navigate('/home/settings/canned-responses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create canned response",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/home/settings/canned-responses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Canned Response</h1>
          <p className="text-muted-foreground">
            Create a new canned response for quick replies
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter a title" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <CannedResponseEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortcut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shortcut</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="/shortcut" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryCombobox {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isShared"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Shared Response</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Make this response available to all team members
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">Create Response</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCannedResponse;
