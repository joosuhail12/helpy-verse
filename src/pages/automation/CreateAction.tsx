
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addAction } from '@/store/slices/actions/actionsSlice';
import { fetchChatbots, selectChatbots, selectChatbotsLoading } from '@/store/slices/chatbots/chatbotsSlice';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import type { ActionMethod } from '@/types/action';

const createActionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  endpoint: z.string().min(1, 'API Endpoint is required'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const),
  description: z.string().min(1, 'Description is required'),
  headers: z.string(),
  parameters: z.string(),
  parameterDescriptions: z.string(),
  connectedChatbots: z.array(z.string()),
});

type FormValues = z.infer<typeof createActionSchema>;

export default function CreateAction() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const chatbots = useAppSelector(selectChatbots);
  const loading = useAppSelector(selectChatbotsLoading);

  useEffect(() => {
    dispatch(fetchChatbots());
  }, [dispatch]);

  const form = useForm<FormValues>({
    resolver: zodResolver(createActionSchema),
    defaultValues: {
      name: '',
      endpoint: '',
      method: 'GET',
      description: '',
      headers: '',
      parameters: '',
      parameterDescriptions: '',
      connectedChatbots: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      // Parse headers from JSON string
      const headers = values.headers ? JSON.parse(values.headers) : {};
      
      // Parse parameters from JSON string and combine with descriptions
      const parametersList = values.parameters ? JSON.parse(values.parameters) : [];
      const parameterDescriptions = values.parameterDescriptions 
        ? JSON.parse(values.parameterDescriptions) 
        : {};

      const parameters = parametersList.map((param: string) => ({
        id: uuidv4(),
        name: param,
        type: 'string',
        description: parameterDescriptions[param] || '',
        required: true,
      }));

      const newAction = {
        id: uuidv4(),
        name: values.name,
        description: values.description,
        endpoint: values.endpoint,
        method: values.method as ActionMethod,
        parameters,
        headers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          id: '1',
          name: 'Current User',
        },
        enabled: true,
        connectedChatbots: values.connectedChatbots,
      };

      dispatch(addAction(newAction));
      
      toast({
        title: "Success",
        description: "Action created successfully",
      });
      
      navigate('/home/automation/ai/action-center');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create action. Please check your JSON formatting.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading chatbots...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Action</h1>
        <p className="text-muted-foreground mt-1">
          Define a new API action for your automation workflows
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter action name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Endpoint</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.example.com/endpoint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HTTP Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select HTTP method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the purpose of this action"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authentication Headers (JSON format)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={'{\n  "Authorization": "Bearer YOUR_TOKEN"\n}'}
                    className="font-mono min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parameters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Parameters (JSON array)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={'[\n  "userId",\n  "email"\n]'}
                    className="font-mono min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parameterDescriptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parameter Descriptions (JSON object)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={'{\n  "userId": "The unique identifier of the user",\n  "email": "User\'s email address"\n}'}
                    className="font-mono min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="connectedChatbots"
            render={() => (
              <FormItem>
                <FormLabel>Connect to Chatbots</FormLabel>
                <div className="mt-2 space-y-2">
                  {chatbots.map((chatbot) => (
                    <div key={chatbot.id} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="connectedChatbots"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(chatbot.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  const newValue = checked
                                    ? [...currentValue, chatbot.id]
                                    : currentValue.filter((id) => id !== chatbot.id);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                {chatbot.name}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {chatbot.description}
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/home/automation/ai/action-center')}
            >
              Cancel
            </Button>
            <Button type="submit">Create Action</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
