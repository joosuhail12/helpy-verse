
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateAction } from '@/store/slices/actions/actionsSlice';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { actionFormSchema } from './dialog/ActionBasicInfo';
import { ActionDialogHeader } from './dialog/ActionDialogHeader';
import { ActionDialogTabs } from './dialog/ActionDialogTabs';
import { UnsavedChangesDialog } from './dialog/UnsavedChangesDialog';
import debounce from 'lodash/debounce';
import type { CustomAction } from '@/types/action';
import type { TestConfig } from './dialog/parameter/types/testConfig';

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
  const [testConfig, setTestConfig] = useState<TestConfig>();

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

  const handleFormChange = () => {
    setIsDirty(true);
    const data = form.getValues();
    debouncedSave(data);
  };

  const handleCloseDialog = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleTest = async (paramValues: Record<string, any>) => {
    const startTime = Date.now();
    try {
      const formData = form.getValues();
      const headers = JSON.parse(formData.headers);
      
      let url = formData.endpoint;
      Object.entries(paramValues).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
      });

      const response = await fetch(url, {
        method: formData.method,
        headers: headers,
        body: formData.method !== 'GET' ? JSON.stringify(paramValues) : undefined,
      });
      
      const responseTime = Date.now() - startTime;
      const responseData = await response.json();
      
      const newTestConfig: TestConfig = {
        parameterValues: paramValues,
        savedAt: new Date().toISOString(),
        responseTime,
        lastResponse: {
          status: response.status,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries()),
        },
      };
      
      setTestConfig(newTestConfig);
      
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
            <form onChange={handleFormChange} className="space-y-4">
              <ActionDialogHeader
                form={form}
                enabled={action?.enabled ?? false}
                isDirty={isDirty}
                onSave={handleManualSave}
              />
              <ActionDialogTabs
                form={form}
                action={action}
                isTestSuccessful={isTestSuccessful}
                isDirty={isDirty}
                onParameterChange={(params) => {
                  if (!action) return;
                  const updatedAction = { ...action, parameters: params };
                  dispatch(updateAction(updatedAction));
                  setIsDirty(true);
                }}
                onTest={handleTest}
                testConfig={testConfig}
                onSaveTestConfig={setTestConfig}
                onUpdate={(updatedAction) => {
                  dispatch(updateAction(updatedAction));
                  setIsDirty(true);
                }}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
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

