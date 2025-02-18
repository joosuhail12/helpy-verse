
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateAction } from '@/store/slices/actions/actionsSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ActionBasicInfo, actionFormSchema } from './dialog/ActionBasicInfo';
import { ActionApiConfig } from './dialog/ActionApiConfig';
import { ActionParameters } from './dialog/ActionParameters';
import { ActionTestPanel } from './dialog/ActionTestPanel';
import { DiscardChangesDialog } from '@/components/automation/content/detail/DiscardChangesDialog';
import debounce from 'lodash/debounce';
import type { CustomAction } from '@/types/action';

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

                  <ActionBasicInfo form={form} />
                  <ActionApiConfig form={form} />
                  <ActionParameters 
                    parameters={action.parameters} 
                    onParameterChange={(params) => {
                      const updatedAction = { ...action, parameters: params };
                      dispatch(updateAction(updatedAction));
                      setIsDirty(true);
                    }} 
                  />
                </TabsContent>

                <TabsContent value="test" className="space-y-4 mt-4">
                  <ActionTestPanel 
                    form={form}
                    isTestSuccessful={isTestSuccessful}
                    onTest={handleTest}
                  />
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

