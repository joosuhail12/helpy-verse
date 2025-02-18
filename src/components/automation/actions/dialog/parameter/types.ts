
import type { CustomAction, ActionParameter } from '@/types/action';

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
  action: CustomAction;
  form: any;
  isTestSuccessful: boolean;
  onTest: () => void;
}

