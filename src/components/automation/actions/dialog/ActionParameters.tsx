
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Key, ListFilter, FileStack, ChevronDown, ChevronUp } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ParameterGroup {
  name: string;
  isOpen: boolean;
  parameters: CustomAction['parameters'];
}

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onParameterChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onParameterChange }: ActionParametersProps) => {
  const [groups, setGroups] = useState<ParameterGroup[]>(() => {
    return [
      { name: 'Authentication', isOpen: true, parameters: [] },
      { name: 'Pagination', isOpen: true, parameters: [] },
      { name: 'Filtering', isOpen: true, parameters: [] },
      { name: 'Other', isOpen: true, parameters: [] }
    ];
  });

  useEffect(() => {
    setGroups([
      { 
        name: 'Authentication', 
        isOpen: true, 
        parameters: parameters.filter(p => 
          p.name.toLowerCase().includes('token') || 
          p.name.toLowerCase().includes('key') || 
          p.name.toLowerCase().includes('auth')
        )
      },
      { 
        name: 'Pagination', 
        isOpen: true, 
        parameters: parameters.filter(p => 
          p.name.toLowerCase().includes('page') || 
          p.name.toLowerCase().includes('limit') ||
          p.name.toLowerCase().includes('offset')
        )
      },
      { 
        name: 'Filtering', 
        isOpen: true, 
        parameters: parameters.filter(p => 
          p.name.toLowerCase().includes('filter') || 
          p.name.toLowerCase().includes('sort') ||
          p.name.toLowerCase().includes('search')
        )
      },
      { 
        name: 'Other', 
        isOpen: true, 
        parameters: parameters.filter(p => 
          !p.name.toLowerCase().includes('token') &&
          !p.name.toLowerCase().includes('key') &&
          !p.name.toLowerCase().includes('auth') &&
          !p.name.toLowerCase().includes('page') &&
          !p.name.toLowerCase().includes('limit') &&
          !p.name.toLowerCase().includes('offset') &&
          !p.name.toLowerCase().includes('filter') &&
          !p.name.toLowerCase().includes('sort') &&
          !p.name.toLowerCase().includes('search')
        )
      }
    ]);
  }, [parameters]);

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

  const handleAddTemplate = (e: React.MouseEvent, templateName: keyof typeof parameterTemplates) => {
    e.preventDefault();
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

  const toggleGroup = (groupName: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.name === groupName ? { ...group, isOpen: !group.isOpen } : group
      )
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parameters</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => handleAddTemplate(e, 'authentication')}
            className="flex items-center gap-1"
          >
            <Key className="h-4 w-4" />
            Auth
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => handleAddTemplate(e, 'pagination')}
            className="flex items-center gap-1"
          >
            <FileStack className="h-4 w-4" />
            Pagination
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => handleAddTemplate(e, 'filtering')}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={parameters.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {groups.map((group) => (
                <Collapsible
                  key={group.name}
                  open={group.isOpen}
                  onOpenChange={() => toggleGroup(group.name)}
                  className="border rounded-lg p-2"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium">{group.name}</span>
                    {group.isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="space-y-4">
                      {group.parameters.map((param) => (
                        <ActionParameter
                          key={param.id}
                          parameter={param}
                          onUpdate={handleUpdateParameter}
                          onDelete={handleDeleteParameter}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {parameters.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No parameters added yet. Click "Add Parameter" or use a template to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
