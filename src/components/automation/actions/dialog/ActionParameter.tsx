
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Text, HashIcon, CheckSquare, GripVertical, Play, AlertCircle } from 'lucide-react';
import type { CustomAction, ParameterDependency } from '@/types/action';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ActionParameterProps {
  parameter: CustomAction['parameters'][0];
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  allParameters: CustomAction['parameters'];
}

export const ActionParameter = ({ parameter, onUpdate, onDelete, allParameters }: ActionParameterProps) => {
  const [showTest, setShowTest] = useState(false);
  const [testValue, setTestValue] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDependencyEditor, setShowDependencyEditor] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: parameter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: parameter.visible === false ? 'none' : 'block',
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'string':
        return <Text className="h-4 w-4 text-blue-500" />;
      case 'number':
        return <HashIcon className="h-4 w-4 text-green-500" />;
      case 'boolean':
        return <CheckSquare className="h-4 w-4 text-purple-500" />;
      case 'object':
      case 'array':
        return <Database className="h-4 w-4 text-orange-500" />;
      default:
        return <Text className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleTypeChange = (newType: string) => {
    onUpdate({ 
      ...parameter, 
      type: newType as 'string' | 'number' | 'boolean' | 'object' | 'array'
    });
    setTestValue('');
    setValidationError(null);
  };

  const getValidationRules = () => {
    const rules = [];
    if (parameter.required) rules.push('Required field');
    switch (parameter.type) {
      case 'number':
        rules.push('Must be a valid number');
        break;
      case 'boolean':
        rules.push('Must be true or false');
        break;
      case 'object':
      case 'array':
        rules.push('Must be valid JSON');
        break;
    }
    return rules;
  };

  const validateParameterValue = () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      if (parameter.required && !testValue) {
        throw new Error('This parameter is required');
      }

      let validatedValue: string;
      
      switch (parameter.type) {
        case 'number':
          if (isNaN(Number(testValue))) {
            throw new Error('Value must be a valid number');
          }
          validatedValue = String(Number(testValue));
          break;
        case 'boolean':
          if (testValue !== 'true' && testValue !== 'false') {
            throw new Error('Value must be either true or false');
          }
          validatedValue = testValue; // Keep as string 'true' or 'false'
          break;
        case 'object':
        case 'array':
          try {
            JSON.parse(testValue);
            validatedValue = testValue;
          } catch {
            throw new Error('Value must be valid JSON');
          }
          break;
        default:
          validatedValue = testValue;
      }

      onUpdate({
        ...parameter,
        defaultValue: validatedValue
      });

      toast({
        title: "Parameter validation passed",
        description: `Value "${testValue}" is valid for parameter type ${parameter.type}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid value';
      setValidationError(errorMessage);
      toast({
        title: "Parameter validation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...parameter, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...parameter, description: e.target.value });
  };

  const handleAddDependency = () => {
    const dependencies = parameter.dependencies || [];
    const newDependency: ParameterDependency = {
      paramId: '',
      condition: {
        value: '',
        operator: 'equals',
      },
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
    <div ref={setNodeRef} style={style} className="space-y-2 pb-4 border-b last:border-0">
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-2 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Input
                  value={parameter.name}
                  onChange={(e) => onUpdate({ ...parameter, name: e.target.value })}
                  placeholder="Parameter name"
                  className={`font-medium ${validationError ? 'border-red-500' : ''}`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter a unique parameter name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Select value={parameter.type} onValueChange={(value) => handleTypeChange(value as CustomAction['parameters'][0]['type'])}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="object">Object</SelectItem>
            <SelectItem value="array">Array</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={showDependencyEditor} onOpenChange={setShowDependencyEditor}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Dependencies
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Parameter Dependencies</h4>
              {(parameter.dependencies || []).map((dependency, index) => (
                <div key={index} className="space-y-2 p-2 border rounded">
                  <Select
                    value={dependency.paramId}
                    onValueChange={(value) => handleUpdateDependency(index, {
                      ...dependency,
                      paramId: value,
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
                    value={dependency.condition.value}
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
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowTest(!showTest)}
          className="flex items-center gap-1"
        >
          <Play className="h-4 w-4" />
          Test
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => onDelete(e, parameter.id)}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </div>

      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Textarea
                  value={parameter.description}
                  onChange={handleDescriptionChange}
                  placeholder="Parameter description"
                  className="text-sm text-muted-foreground"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Provide a clear description of the parameter's purpose</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5">
            {getTypeIcon(parameter.type)}
            <Badge variant="outline">{parameter.type}</Badge>
          </div>
          {parameter.required && <Badge variant="default">Required</Badge>}
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="font-medium">Validation Rules:</div>
          <ul className="list-disc list-inside space-y-1">
            {getValidationRules().map((rule, index) => (
              <li key={index} className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showTest && (
        <div className="space-y-2 mt-2">
          <Input
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            placeholder={`Enter test ${parameter.type} value`}
            className={`flex-1 ${validationError ? 'border-red-500' : ''}`}
          />
          {validationError && (
            <div className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationError}
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={validateParameterValue}
            disabled={isValidating}
          >
            Validate
          </Button>
        </div>
      )}
    </div>
  );
};

