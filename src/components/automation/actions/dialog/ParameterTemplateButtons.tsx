import { Button } from '@/components/ui/button';
import { Key, ListFilter, FileStack, Plus } from 'lucide-react';

interface ParameterTemplateButtonsProps {
  onAddTemplate: (e: React.MouseEvent, templateName: 'authentication' | 'pagination' | 'filtering') => void;
  onAddParameter: (e: React.MouseEvent) => void;
}

export const ParameterTemplateButtons = ({
  onAddTemplate,
  onAddParameter,
}: ParameterTemplateButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => onAddTemplate(e, 'authentication')}
        className="flex items-center gap-1"
      >
        <Key className="h-4 w-4" />
        Auth
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => onAddTemplate(e, 'pagination')}
        className="flex items-center gap-1"
      >
        <FileStack className="h-4 w-4" />
        Pagination
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => onAddTemplate(e, 'filtering')}
        className="flex items-center gap-1"
      >
        <ListFilter className="h-4 w-4" />
        Filtering
      </Button>
      <Button 
        type="button"
        variant="outline" 
        size="sm" 
        onClick={onAddParameter}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        Add Parameter
      </Button>
    </div>
  );
};
