
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useCustomDataMutations } from "@/hooks/useCustomDataMutations";
import type { CustomField, CustomFieldType, ValidationRule, FieldDependency, FieldHistoryEntry } from "@/types/customField";
import ValidationRulesSection from './ValidationRulesSection';
import DependenciesSection from './DependenciesSection';
import FieldOptionsSection from './FieldOptionsSection';
import FieldDetailsForm from './components/FieldDetailsForm';
import { validateFieldName, getDefaultValidationRules } from './utils/fieldValidation';

interface AddCustomFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  table: 'tickets' | 'contacts' | 'companies';
  existingFields: CustomField[];
}

const AddCustomFieldDialog = ({ isOpen, onClose, table, existingFields }: AddCustomFieldDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<CustomFieldType>("text");
  const [required, setRequired] = useState(false);
  const [description, setDescription] = useState("");
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [dependencies, setDependencies] = useState<FieldDependency[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const { toast } = useToast();
  const { addCustomField, isLoading } = useCustomDataMutations();

  const handleTypeChange = (newType: CustomFieldType) => {
    setType(newType);
    setValidationRules(getDefaultValidationRules(newType));
    if (!['select', 'multi-select'].includes(newType)) {
      setOptions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameValidationErrors = validateFieldName(name, existingFields);
    if (nameValidationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: (
          <ul className="list-disc pl-4">
            {nameValidationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
      return;
    }

    if (['select', 'multi-select'].includes(type) && options.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one option for select/multi-select fields.",
        variant: "destructive",
      });
      return;
    }

    if (['select', 'multi-select'].includes(type)) {
      const duplicateOptions = options.filter((option, index) => 
        options.indexOf(option) !== index
      );
      if (duplicateOptions.length > 0) {
        toast({
          title: "Validation Error",
          description: "Duplicate options are not allowed.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const timestamp = new Date().toISOString();
      const historyEntry: FieldHistoryEntry = {
        id: Math.random().toString(),
        timestamp,
        userId: 'current-user',
        userName: 'Current User',
        action: 'created',
        changes: []
      };

      await addCustomField({
        table,
        field: {
          name,
          type,
          required,
          description,
          validationRules,
          dependencies,
          options: ['select', 'multi-select'].includes(type) ? options : undefined,
          history: [historyEntry]
        }
      });
      
      toast({
        title: "Success",
        description: "Custom field has been added successfully.",
      });
      
      onClose();
      setName("");
      setType("text");
      setRequired(false);
      setDescription("");
      setValidationRules([]);
      setDependencies([]);
      setOptions([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add custom field. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showOptionsSection = ['select', 'multi-select'].includes(type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
            <DialogDescription>
              Add a new custom field to the {table} table.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <FieldDetailsForm
              name={name}
              type={type}
              required={required}
              description={description}
              onNameChange={setName}
              onTypeChange={handleTypeChange}
              onRequiredChange={setRequired}
              onDescriptionChange={setDescription}
            />
            
            {showOptionsSection && (
              <FieldOptionsSection
                options={options}
                onOptionsChange={setOptions}
              />
            )}
            
            <ValidationRulesSection
              rules={validationRules}
              onRulesChange={setValidationRules}
            />
            
            <DependenciesSection
              dependencies={dependencies}
              onDependenciesChange={setDependencies}
              availableFields={existingFields}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Field"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomFieldDialog;

