
import type { CustomAction } from '@/types/action';

export interface ParameterGroup {
  name: string;
  isOpen: boolean;
  parameters: CustomAction['parameters'];
}

export interface ParameterGroupsState {
  authentication: ParameterGroup;
  pagination: ParameterGroup;
  filtering: ParameterGroup;
  other: ParameterGroup;
}
