
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { CustomAction } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';
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
import { ParameterGroup } from './ParameterGroup';
import { ParameterTemplateButtons } from './ParameterTemplateButtons';

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onParameterChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onParameterChange }: ActionParametersProps) => {
  const [groups, setGroups] = useState<Array<{
    name: string;
    isOpen: boolean;
    parameters: CustomAction['parameters'];
  }>>(() => {
    return [
      { name: 'Authentication', isOpen: true, parameters: [] },
      { name: 'Pagination', isOpen: true, parameters: [] },
      { name: 'Filtering', isOpen: true, parameters: [] },
      { name: 'Other', isOpen: true, parameters: [] }
    ];
  });

  const evaluateDependencies = (parameters: CustomAction['parameters']) => {
    return parameters.map(param => {
      if (!param.dependencies || param.dependencies.length === 0) {
        return { ...param, visible: true };
      }

      const isVisible = param.dependencies.every(dependency => {
        const dependentParam = parameters.find(p => p.id === dependency.paramId);
        if (!dependentParam) return true;

        const dependentValue = dependentParam.defaultValue || '';
        const { value, operator } = dependency.condition;

        switch (operator) {
          case 'equals':
            return dependentValue === String(value);
          case 'notEquals':
            return dependentValue !== String(value);
          case 'contains':
            return dependentValue.includes(String(value));
          case 'greaterThan':
            return Number(dependentValue) > Number(value);
          case 'lessThan':
            return Number(dependentValue) < Number(value);
          default:
            return true;
        }
      });

      return { ...param, visible: isVisible };
    });
  };

  useEffect(() => {
    const evaluatedParameters = evaluateDependencies(parameters);
    
    setGroups([
      { 
        name: 'Authentication', 
        isOpen: true, 
        parameters: evaluatedParameters.filter(p => 
          p.name.toLowerCase().includes('token') || 
          p.name.toLowerCase().includes('key') || 
          p.name.toLowerCase().includes('auth')
        )
      },
      { 
        name: 'Pagination', 
        isOpen: true, 
        parameters: evaluatedParameters.filter(p => 
          p.name.toLowerCase().includes('page') || 
          p.name.toLowerCase().includes('limit') ||
          p.name.toLowerCase().includes('offset')
        )
      },
      { 
        name: 'Filtering', 
        isOpen: true, 
        parameters: evaluatedParameters.filter(p => 
          p.name.toLowerCase().includes('filter') || 
          p.name.toLowerCase().includes('sort') ||
          p.name.toLowerCase().includes('search')
        )
      },
      { 
        name: 'Other', 
        isOpen: true, 
        parameters: evaluatedParameters.filter(p => 
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
    const evaluatedParams = evaluateDependencies(updatedParams);
    onParameterChange(evaluatedParams);
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
        <ParameterTemplateButtons
          onAddTemplate={handleAddTemplate}
          onAddParameter={handleAddParameter}
        />
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
                <ParameterGroup
                  key={group.name}
                  name={group.name}
                  isOpen={group.isOpen}
                  onToggle={() => toggleGroup(group.name)}
                  parameters={group.parameters}
                  onUpdate={handleUpdateParameter}
                  onDelete={handleDeleteParameter}
                  allParameters={parameters}
                />
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
