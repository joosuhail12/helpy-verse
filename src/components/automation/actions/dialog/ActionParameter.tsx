import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, Play, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ActionParameterProps } from './parameter/types';
import { TypeIndicator } from './parameter/TypeIndicator';
import { DependencyEditor } from './parameter/DependencyEditor';
import { ParameterTest } from './parameter/ParameterTest';
import { getValidationRules } from './parameter/validation';

export const ActionParameter = ({ 
  parameter, 
  onUpdate, 
  onDelete, 
  allParameters 
}: ActionParameterProps) => {
  const [showTest, setShowTest] = useState(false);
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

  const handleTypeChange = (newType: string) => {
    onUpdate({ 
      ...parameter, 
      type: newType as typeof parameter.type
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...parameter, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...parameter, description: e.target.value });
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
                  onChange={handleNameChange}
                  placeholder="Parameter name"
                  className="font-medium"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter a unique parameter name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Select value={parameter.type} onValueChange={handleTypeChange}>
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
            <DependencyEditor
              parameter={parameter}
              allParameters={allParameters}
              onUpdate={onUpdate}
            />
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
          <TypeIndicator type={parameter.type} />
          {parameter.required && <Badge variant="default">Required</Badge>}
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="font-medium">Validation Rules:</div>
          <ul className="list-disc list-inside space-y-1">
            {getValidationRules(parameter).map((rule, index) => (
              <li key={index} className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showTest && (
        <ParameterTest
          parameter={parameter}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};
