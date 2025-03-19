
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createActionSchema, FormValues } from './create-action/schema';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addAction } from '@/store/slices/actions/actionsSlice';
import { LoadingState } from '@/components/automation/create-action/LoadingState';

const CreateActionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(createActionSchema),
    defaultValues: {
      name: '',
      toolName: '',
      endpoint: '',
      method: 'GET',
      description: '',
      headers: '{}',
      parameters: '[]',
      parameterDescriptions: '{}',
      connectedChatbots: [],
      category: 'Custom',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Parse JSON fields
      const parsedHeaders = JSON.parse(values.headers);
      const parsedParameters = JSON.parse(values.parameters);
      const parsedParameterDescriptions = JSON.parse(values.parameterDescriptions);
      
      // Create action object
      const newAction = {
        id: `action-${Date.now()}`,
        name: values.name,
        toolName: values.toolName,
        description: values.description,
        endpoint: values.endpoint,
        method: values.method,
        parameters: parsedParameters,
        headers: parsedHeaders,
        parameterDescriptions: parsedParameterDescriptions,
        connectedChatbots: values.connectedChatbots.map(id => ({ 
          id, 
          name: `Chatbot ${id}` 
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        category: values.category,
        createdBy: {
          id: 'user1',
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Admin',
        },
        enabled: true,
      };
      
      dispatch(addAction(newAction));
      
      toast({
        title: "Action created",
        description: `${values.name} has been successfully created.`,
      });
      
      navigate('/home/automation/actions');
    } catch (error) {
      console.error('Error creating action:', error);
      toast({
        title: "Error",
        description: "Failed to create action. Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitting) {
    return <LoadingState />;
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Action</CardTitle>
          <CardDescription>
            Configure a new API action that can be used by your chatbots.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Get Weather Data" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this action.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Name</FormLabel>
                      <FormControl>
                        <Input placeholder="getWeather" {...field} />
                      </FormControl>
                      <FormDescription>
                        The function name that will be used in the chatbot.
                      </FormDescription>
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
                          placeholder="Gets current weather data for a location" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed description of what this action does.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Custom">Custom</SelectItem>
                            <SelectItem value="Data">Data</SelectItem>
                            <SelectItem value="Integration">Integration</SelectItem>
                            <SelectItem value="Utility">Utility</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Group similar actions together.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://api.example.com/weather?location={location}" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The URL to call. Use {'{parameter}'} for dynamic values.
                      </FormDescription>
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
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
                  name="headers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headers (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={'{\n  "Content-Type": "application/json"\n}'} 
                          className="font-mono h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        HTTP headers in JSON format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parameters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parameters (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={'[\n  {\n    "id": "location",\n    "name": "Location",\n    "type": "string",\n    "required": true\n  }\n]'} 
                          className="font-mono h-48" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Parameters this action accepts in JSON format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/home/automation/actions')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Action
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateActionPage;
