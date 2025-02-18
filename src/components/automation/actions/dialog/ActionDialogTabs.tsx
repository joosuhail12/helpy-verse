
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { actionFormSchema } from './ActionBasicInfo';
import { ActionBasicInfo } from './ActionBasicInfo';
import { ActionApiConfig } from './ActionApiConfig';
import { ActionParameters } from './ActionParameters';
import { ActionTestPanel } from './ActionTestPanel';
import type { CustomAction } from '@/types/action';

interface ActionDialogTabsProps {
  form: UseFormReturn<z.infer<typeof actionFormSchema>>;
  action: CustomAction;
  isTestSuccessful: boolean;
  isDirty: boolean;
  onParameterChange: (params: CustomAction['parameters']) => void;
  onTest: () => void;
}

export const ActionDialogTabs = ({ 
  form, 
  action, 
  isTestSuccessful, 
  isDirty,
  onParameterChange,
  onTest,
}: ActionDialogTabsProps) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Action Details</TabsTrigger>
        <TabsTrigger value="test">Test API</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-4 mt-4">
        <ActionBasicInfo form={form} />
        <ActionApiConfig form={form} />
        <ActionParameters 
          parameters={action.parameters} 
          onParameterChange={onParameterChange}
        />
      </TabsContent>

      <TabsContent value="test" className="space-y-4 mt-4">
        <ActionTestPanel 
          form={form}
          isTestSuccessful={isTestSuccessful}
          onTest={onTest}
        />
      </TabsContent>
    </Tabs>
  );
};
