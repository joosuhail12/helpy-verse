
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addAction } from '@/store/slices/actions/actionsSlice';
import { fetchChatbots, selectChatbots, selectChatbotsLoading } from '@/store/slices/chatbots/chatbotsSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Check, Plus, X } from 'lucide-react';
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
  const [isSelecting, setIsSelecting] = useState(false);

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
      const headers = values.headers ? JSON.parse(values.headers) : {};
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

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Connected Chatbots</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelecting(!isSelecting)}
                >
                  {isSelecting ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>

              <FormField
                control={form.control}
                name="connectedChatbots"
                render={({ field }) => (
                  <FormItem>
                    {isSelecting ? (
                      <div className="grid gap-2">
                        {chatbots.map((chatbot) => {
                          const isConnected = field.value?.includes(chatbot.id);
                          return (
                            <div
                              key={chatbot.id}
                              className="flex items-center justify-between p-3 border rounded-md bg-white/50"
                            >
                              <div>
                                <p className="font-medium">{chatbot.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {chatbot.description}
                                </p>
                              </div>
                              <Button
                                variant={isConnected ? "ghost" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  const newValue = isConnected
                                    ? currentValue.filter((id) => id !== chatbot.id)
                                    : [...currentValue, chatbot.id];
                                  field.onChange(newValue);
                                }}
                              >
                                {isConnected ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Connected
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Connect
                                  </>
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {field.value?.length ? (
                          chatbots
                            .filter((chatbot) => field.value?.includes(chatbot.id))
                            .map((chatbot) => (
                              <div
                                key={chatbot.id}
                                className="flex items-center justify-between p-3 border rounded-md bg-white/50"
                              >
                                <span className="font-medium">{chatbot.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newValue = field.value?.filter(
                                      (id) => id !== chatbot.id
                                    );
                                    field.onChange(newValue);
                                  }}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Disconnect
                                </Button>
                              </div>
                            ))
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            No chatbots connected
                          </p>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

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
