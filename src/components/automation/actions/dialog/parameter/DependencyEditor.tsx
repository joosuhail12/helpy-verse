
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import type { CustomAction, ParameterDependency } from '@/types/action';

interface DependencyEditorProps {
  parameter: CustomAction['parameters'][0];
  allParameters: CustomAction['parameters'];
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void;
}

export const DependencyEditor = ({ parameter, allParameters, onUpdate }: DependencyEditorProps) => {
  const handleAddDependency = () => {
    const dependencies = parameter.dependencies || [];
    const newDependency: ParameterDependency = {
      sourceParameterId: '',
      condition: {
        operator: 'equals',
        value: '',
      }
    };
    onUpdate({
      ...parameter,
      dependencies: [...dependencies, newDependency],
    });
  };

  const handleUpdateDependency = (index: number, updatedDependency: ParameterDependency) => {
    const dependencies = [...(parameter.dependencies || [])];
    dependencies[index] = updatedDependency;
    onUpdate({
      ...parameter,
      dependencies,
    });
  };

  const handleRemoveDependency = (index: number) => {
    const dependencies = [...(parameter.dependencies || [])];
    dependencies.splice(index, 1);
    onUpdate({
      ...parameter,
      dependencies,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Parameter Dependencies</h4>
      {(parameter.dependencies || []).map((dependency, index) => (
        <div key={index} className="space-y-2 p-2 border rounded">
          <Select
            value={dependency.sourceParameterId}
            onValueChange={(value) => handleUpdateDependency(index, {
              ...dependency,
              sourceParameterId: value,
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parameter" />
            </SelectTrigger>
            <SelectContent>
              {allParameters
                .filter(p => p.id !== parameter.id)
                .map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          <Select
            value={dependency.condition.operator}
            onValueChange={(value) => handleUpdateDependency(index, {
              ...dependency,
              condition: {
                ...dependency.condition,
                operator: value as ParameterDependency['condition']['operator'],
              },
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="notEquals">Not Equals</SelectItem>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="greaterThan">Greater Than</SelectItem>
              <SelectItem value="lessThan">Less Than</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Value"
            value={String(dependency.condition.value)}
            onChange={(e) => handleUpdateDependency(index, {
              ...dependency,
              condition: {
                ...dependency.condition,
                value: e.target.value,
              },
            })}
          />

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveDependency(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddDependency}
        className="w-full"
      >
        Add Dependency
      </Button>
    </div>
  );
};
