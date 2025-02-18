
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { parameterTemplates } from './templates/parameterTemplates';
import { v4 as uuidv4 } from 'uuid';
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
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { ParameterGroup } from './ParameterGroup';
import { ParameterTemplateButtons } from './ParameterTemplateButtons';
import { groupParameters } from './parameter/utils/groupParameters';
import type { ParameterGroupsState } from './parameter/types/parameterGroup';
import type { CustomAction } from '@/types/action';

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onChange }: ActionParametersProps) => {
  const [groups, setGroups] = useState<ParameterGroupsState>(groupParameters(parameters));

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
    setGroups(groupParameters(evaluatedParameters));
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
    onChange([...parameters, newParameter]);
  };

  const handleAddTemplate = (e: React.MouseEvent, templateName: keyof typeof parameterTemplates) => {
    e.preventDefault();
    const newParameters = parameterTemplates[templateName].map(param => ({
      ...param,
      id: uuidv4(),
    }));
    onChange([...parameters, ...newParameters]);
  };

  const handleDeleteParameter = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const updatedParams = parameters.filter(param => param.id !== id);
    onChange(updatedParams);
  };

  const handleUpdateParameter = (updatedParam: CustomAction['parameters'][0]) => {
    const updatedParams = parameters.map(p => 
      p.id === updatedParam.id ? updatedParam : p
    );
    const evaluatedParams = evaluateDependencies(updatedParams);
    onChange(evaluatedParams);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parameters.findIndex((param) => param.id === active.id);
      const newIndex = parameters.findIndex((param) => param.id === over.id);
      
      onChange(arrayMove(parameters, oldIndex, newIndex));
    }
  };

  const toggleGroup = (groupName: string) => {
    setGroups(prevGroups => {
      const updatedGroups = { ...prevGroups };
      const group = Object.entries(updatedGroups).find(([_, group]) => group.name === groupName);
      if (group) {
        const [key] = group;
        updatedGroups[key as keyof ParameterGroupsState].isOpen = 
          !updatedGroups[key as keyof ParameterGroupsState].isOpen;
      }
      return updatedGroups;
    });
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
              {Object.values(groups).map((group) => (
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
