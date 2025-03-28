
import type { CustomAction, ActionParameter } from '@/types/action';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import type { actionFormSchema } from '../ActionBasicInfo';
import type { TestConfig } from './types/testConfig';

export interface ActionParameterProps {
  parameter: ActionParameter;
  onUpdate: (updatedParam: ActionParameter) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  allParameters: ActionParameter[];
}

export interface ParameterTestProps {
  parameter: ActionParameter;
  onUpdate: (updatedParam: ActionParameter) => void;
}

export interface ActionParametersProps {
  parameters: ActionParameter[];
  onChange: (params: ActionParameter[]) => void;
}

export interface ActionTestPanelProps {
  form: UseFormReturn<z.infer<typeof actionFormSchema>>;
  isTestSuccessful: boolean;
  onTest: (paramValues: Record<string, any>) => Promise<void>;
  parameters: ActionParameter[];
  testConfig?: TestConfig;
  onSaveConfig: (config: TestConfig) => void;
}
