
import type { CustomAction, ActionParameter } from '@/types/action';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import type { actionFormSchema } from '../ActionBasicInfo';

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
  onTest: () => void;
}

