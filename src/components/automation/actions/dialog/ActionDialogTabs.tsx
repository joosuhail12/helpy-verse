
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cog, Play, Bot } from 'lucide-react';
import { ActionParameters } from './ActionParameters';
import { ActionTestPanel } from './ActionTestPanel';
import { ChatbotConnections } from './ChatbotConnections';
import { ActionApiConfig } from './ActionApiConfig';
import { useForm } from 'react-hook-form';
import { actionFormSchema } from './ActionBasicInfo';
import * as z from 'zod';
import type { CustomAction } from '@/types/action';
import type { TestConfig } from './parameter/types/testConfig';

interface ActionDialogTabsProps {
  form: ReturnType<typeof useForm<z.infer<typeof actionFormSchema>>>;
  action: CustomAction;
  isTestSuccessful: boolean;
  isDirty: boolean;
  onParameterChange: (params: CustomAction['parameters']) => void;
  onTest: (paramValues: Record<string, any>) => Promise<void>;
  testConfig?: TestConfig;
  onSaveTestConfig: (config: TestConfig) => void;
  onUpdate: (updatedAction: CustomAction) => void;
}

export const ActionDialogTabs = ({
  form,
  action,
  isTestSuccessful,
  isDirty,
  onParameterChange,
  onTest,
  testConfig,
  onSaveTestConfig,
  onUpdate,
}: ActionDialogTabsProps) => {
  return (
    <Tabs defaultValue="parameters" className="flex-1">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="parameters">
          <Cog className="h-4 w-4 mr-2" />
          Parameters
        </TabsTrigger>
        <TabsTrigger value="test">
          <Play className="h-4 w-4 mr-2" />
          Test
        </TabsTrigger>
        <TabsTrigger value="chatbots">
          <Bot className="h-4 w-4 mr-2" />
          Chatbots
        </TabsTrigger>
      </TabsList>
      <TabsContent value="parameters" className="mt-4 space-y-4">
        <ActionApiConfig form={form} />
        <ActionParameters
          parameters={action.parameters}
          onChange={onParameterChange}
        />
      </TabsContent>
      <TabsContent value="test" className="mt-4">
        <ActionTestPanel
          form={form}
          isTestSuccessful={isTestSuccessful}
          onTest={onTest}
          parameters={action.parameters}
          testConfig={testConfig}
          onSaveConfig={onSaveTestConfig}
        />
      </TabsContent>
      <TabsContent value="chatbots" className="mt-4">
        <ChatbotConnections 
          action={action}
          onUpdate={onUpdate}
        />
      </TabsContent>
    </Tabs>
  );
};
