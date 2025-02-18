
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, Suspense, lazy } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addAction } from '@/store/slices/actions/actionsSlice';
import { fetchChatbots, selectChatbotsLoading } from '@/store/slices/chatbots/chatbotsSlice';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { LoadingState } from '@/components/automation/create-action/LoadingState';
import { createActionSchema, type FormValues } from './create-action/schema';
import type { ActionMethod } from '@/types/action';

const BasicInformation = lazy(() => import('./create-action/BasicInformation').then(module => ({ 
  default: module.BasicInformation 
})));

const ApiConfiguration = lazy(() => import('./create-action/ApiConfiguration').then(module => ({ 
  default: module.ApiConfiguration 
})));

const ChatbotConnection = lazy(() => import('./create-action/ChatbotConnection').then(module => ({ 
  default: module.ChatbotConnection 
})));

export default function CreateAction() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const loading = useAppSelector(selectChatbotsLoading);

  const form = useForm<FormValues>({
    resolver: zodResolver(createActionSchema),
    defaultValues: {
      name: '',
      toolName: '',
      endpoint: '',
      method: 'GET',
      description: '',
      headers: '',
      parameters: '',
      parameterDescriptions: '',
      connectedChatbots: [],
    },
  });

  useEffect(() => {
    dispatch(fetchChatbots());
  }, [dispatch]);

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
        toolName: values.toolName,
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
          <Suspense fallback={<LoadingState />}>
            <BasicInformation form={form} />
          </Suspense>
          <Suspense fallback={<LoadingState />}>
            <ApiConfiguration form={form} />
          </Suspense>
          <Suspense fallback={<LoadingState />}>
            <ChatbotConnection form={form} />
          </Suspense>

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

