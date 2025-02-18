
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Text, HashIcon, CheckSquare, GripVertical } from 'lucide-react';
import type { CustomAction } from '@/types/action';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface ActionParameterProps {
  parameter: CustomAction['parameters'][0];
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const ActionParameter = ({ parameter, onUpdate, onDelete }: ActionParameterProps) => {
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
        <Input
          value={parameter.name}
          onChange={(e) => onUpdate({ ...parameter, name: e.target.value })}
          placeholder="Parameter name"
          className="font-medium"
        />
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
        <Textarea
          value={parameter.description}
          onChange={(e) => onUpdate({ ...parameter, description: e.target.value })}
          placeholder="Parameter description"
          className="text-sm text-muted-foreground"
        />
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5">
            {getTypeIcon(parameter.type)}
            <Badge variant="outline">{parameter.type}</Badge>
          </div>
          {parameter.required && <Badge variant="default">Required</Badge>}
        </div>
      </div>
    </div>
  );
};
