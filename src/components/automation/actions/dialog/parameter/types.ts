
import type { CustomAction, ParameterDependency } from '@/types/action';

export interface ActionParameterProps {
  parameter: CustomAction['parameters'][0];
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  allParameters: CustomAction['parameters'];
}

export interface ParameterTestProps {
  parameter: CustomAction['parameters'][0];
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void;
}

