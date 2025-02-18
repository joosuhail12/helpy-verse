
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ActionParameter } from '@/types/action';

interface TestParameterInputProps {
  parameter: ActionParameter;
  value: any;
  onChange: (value: any) => void;
}

export const TestParameterInput = ({ parameter, value, onChange }: TestParameterInputProps) => {
  if (!parameter.visible) return null;

  switch (parameter.type) {
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={`test-${parameter.id}`}
            checked={Boolean(value)}
            onCheckedChange={onChange}
          />
          <Label htmlFor={`test-${parameter.id}`}>{parameter.name}</Label>
        </div>
      );
    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={`test-${parameter.id}`}>{parameter.name}</Label>
          <Input
            id={`test-${parameter.id}`}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={parameter.description}
          />
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={`test-${parameter.id}`}>{parameter.name}</Label>
          <Input
            id={`test-${parameter.id}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={parameter.description}
          />
        </div>
      );
  }
};

