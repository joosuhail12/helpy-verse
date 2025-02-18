
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ActionParameter as ActionParameterComponent } from './ActionParameter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { CustomAction } from '@/types/action';

interface ParameterGroupProps {
  name: string;
  isOpen: boolean;
  onToggle: () => void;
  parameters: CustomAction['parameters'];
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  allParameters: CustomAction['parameters'];
}

export const ParameterGroup = ({ 
  name,
  isOpen,
  onToggle,
  parameters,
  onUpdate,
  onDelete,
  allParameters,
}: ParameterGroupProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border rounded-lg p-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
        <span className="font-medium">{name}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="space-y-4">
          {parameters.map((param) => (
            <ActionParameterComponent
              key={param.id}
              parameter={param}
              onUpdate={onUpdate}
              onDelete={onDelete}
              allParameters={allParameters}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
