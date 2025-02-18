
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Key, ListFilter, FileStack } from 'lucide-react';
import type { CustomAction } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';
import { ActionParameter } from './ActionParameter';
import { parameterTemplates } from './templates/parameterTemplates';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onParameterChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onParameterChange }: ActionParametersProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddParameter = (e: React.MouseEvent) => {
    e.preventDefault();
    const newParameter = {
      id: uuidv4(),
      name: '',
      type: 'string' as const,
      description: '',
      required: true,
    };
    onParameterChange([...parameters, newParameter]);
  };

  const handleAddTemplate = (templateName: keyof typeof parameterTemplates) => {
    const newParameters = parameterTemplates[templateName].map(param => ({
      ...param,
      id: uuidv4(),
    }));
    onParameterChange([...parameters, ...newParameters]);
  };

  const handleDeleteParameter = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const updatedParams = parameters.filter(param => param.id !== id);
    onParameterChange(updatedParams);
  };

  const handleUpdateParameter = (updatedParam: CustomAction['parameters'][0]) => {
    const updatedParams = parameters.map(p => 
      p.id === updatedParam.id ? updatedParam : p
    );
    onParameterChange(updatedParams);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parameters.findIndex((param) => param.id === active.id);
      const newIndex = parameters.findIndex((param) => param.id === over.id);
      
      onParameterChange(arrayMove(parameters, oldIndex, newIndex));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parameters</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddTemplate('authentication')}
            className="flex items-center gap-1"
          >
            <Key className="h-4 w-4" />
            Auth
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddTemplate('pagination')}
            className="flex items-center gap-1"
          >
            <FileStack className="h-4 w-4" />
            Pagination
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddTemplate('filtering')}
            className="flex items-center gap-1"
          >
            <ListFilter className="h-4 w-4" />
            Filtering
          </Button>
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            onClick={handleAddParameter}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Parameter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={parameters.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {parameters.map((param) => (
                <ActionParameter
                  key={param.id}
                  parameter={param}
                  onUpdate={handleUpdateParameter}
                  onDelete={handleDeleteParameter}
                />
              ))}
            </SortableContext>
          </DndContext>
          {parameters.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No parameters added yet. Click "Add Parameter" or use a template to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

