
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateAction } from '@/store/slices/actions/actionsSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Save, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DiscardChangesDialog } from '@/components/automation/content/detail/DiscardChangesDialog';
import debounce from 'lodash/debounce';
import type { CustomAction } from '@/types/action';

const actionFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  toolName: z.string().min(1, 'Tool name is required'),
  description: z.string().min(1, 'Description is required'),
  endpoint: z.string().url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  headers: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, 'Must be valid JSON'),
});

interface ActionDetailDialogProps {
  action: CustomAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ActionDetailDialog = ({ action, open, onOpenChange }: ActionDetailDialogProps) => {
  const dispatch = useAppDispatch();
  const [isTestSuccessful, setIsTestSuccessful] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      name: action?.name || '',
      toolName: action?.toolName || '',
      description: action?.description || '',
      endpoint: action?.endpoint || '',
      method: action?.method || 'GET',
      headers: action?.headers ? JSON.stringify(action.headers, null, 2) : '{}',
    },
  });

  // Reset form when action changes
  useEffect(() => {
    if (action) {
      form.reset({
        name: action.name,
        toolName: action.toolName,
        description: action.description,
        endpoint: action.endpoint,
        method: action.method,
        headers: JSON.stringify(action.headers, null, 2),
      });
      setIsDirty(false);
    }
  }, [action, form]);

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce((data: z.infer<typeof actionFormSchema>) => {
      if (!action) return;
      
      const updatedAction: CustomAction = {
        ...action,
        ...data,
        headers: JSON.parse(data.headers),
      };
      
      dispatch(updateAction(updatedAction));
      toast({
        title: "Changes auto-saved",
        description: "Your changes have been automatically saved.",
      });
    }, 2000),
    [action, dispatch]
  );

  // Handle form changes
  const onFormChange = () => {
    setIsDirty(true);
    const data = form.getValues();
    debouncedSave(data);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleTest = async () => {
    try {
      const formData = form.getValues();
      const response = await fetch(formData.endpoint, {
        method: formData.method,
        headers: JSON.parse(formData.headers),
      });
      
      if (response.ok) {
        setIsTestSuccessful(true);
        toast({
          title: "Test successful",
          description: "The API action was tested successfully.",
        });
      } else {
        throw new Error('API test failed');
      }
    } catch (error) {
      setIsTestSuccessful(false);
      toast({
        title: "Test failed",
        description: "The API action test was unsuccessful. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const handleManualSave = () => {
    form.handleSubmit((data) => {
      if (!action) return;
      
      const updatedAction: CustomAction = {
        ...action,
        ...data,
        headers: JSON.parse(data.headers),
      };
      
      dispatch(updateAction(updatedAction));
      setIsDirty(false);
      toast({
        title: "Changes saved",
        description: "The action has been updated successfully.",
      });
    })();
  };

  if (!action) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form onChange={onFormChange} className="space-y-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Action Details</TabsTrigger>
                  <TabsTrigger value="test">Test API</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="text-2xl font-bold h-auto px-2 py-1 max-w-[300px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Badge variant={action.enabled ? 'default' : 'secondary'}>
                        {action.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <Button onClick={handleManualSave} disabled={!isDirty}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[100px]" />
                            </FormControl>
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>API Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="endpoint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endpoint</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select method" />
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
                            <FormLabel>Headers</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="font-mono" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Parameters section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {action.parameters.map((param) => (
                          <div key={param.id}>
                            <Input
                              value={param.name}
                              onChange={(e) => {
                                const updatedParams = action.parameters.map(p => 
                                  p.id === param.id ? { ...p, name: e.target.value } : p
                                );
                                setIsDirty(true);
                              }}
                              className="font-medium mb-1"
                            />
                            <div className="mt-1 space-y-1">
                              <Textarea
                                value={param.description}
                                onChange={(e) => {
                                  const updatedParams = action.parameters.map(p => 
                                    p.id === param.id ? { ...p, description: e.target.value } : p
                                  );
                                  setIsDirty(true);
                                }}
                                className="text-sm text-muted-foreground"
                              />
                              <div className="flex gap-2">
                                <Badge variant="outline">{param.type}</Badge>
                                {param.required && <Badge variant="default">Required</Badge>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="test" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test API Action</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Endpoint URL</h3>
                        <p className="text-sm font-mono bg-muted p-2 rounded">
                          {form.getValues('endpoint')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Method</h3>
                        <Badge variant="outline">{form.getValues('method')}</Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Headers</h3>
                        <pre className="text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
                          {form.getValues('headers')}
                        </pre>
                      </div>
                      <Button 
                        onClick={handleTest}
                        variant={isTestSuccessful ? "default" : "secondary"}
                        className="w-full"
                      >
                        Test API Action
                      </Button>
                      {isTestSuccessful && (
                        <div className="text-sm text-green-600">
                          API test was successful. You can now enable this action.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DiscardChangesDialog
        isOpen={showDiscardDialog}
        onConfirm={() => {
          setShowDiscardDialog(false);
          onOpenChange(false);
          form.reset();
          setIsDirty(false);
        }}
        onCancel={() => setShowDiscardDialog(false)}
      />
    </>
  );
};

