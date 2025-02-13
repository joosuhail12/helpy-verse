import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useCustomDataMutations } from "@/hooks/useCustomDataMutations";
import type { CustomField, CustomFieldType, ValidationRule, FieldDependency, FieldHistoryEntry } from "@/types/customField";
import ValidationRulesSection from "./ValidationRulesSection";
import DependenciesSection from "./DependenciesSection";
import FieldOptionsSection from "./FieldOptionsSection";

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

  const getDefaultValidationRules = (fieldType: CustomFieldType): ValidationRule[] => {
    switch (fieldType) {
      case 'email':
        return [{
          type: 'regex',
          value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          message: 'Please enter a valid email address'
        }];
      case 'phone':
        return [{
          type: 'regex',
          value: '^\\+?[1-9]\\d{1,14}$',
          message: 'Please enter a valid phone number'
        }];
      case 'url':
        return [{
          type: 'regex',
          value: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$',
          message: 'Please enter a valid URL'
        }];
      case 'currency':
        return [
          {
            type: 'regex',
            value: '^\\d+(\\.\\d{1,2})?$',
            message: 'Please enter a valid currency amount'
          },
          {
            type: 'min',
            value: '0',
            message: 'Amount must be greater than or equal to 0'
          }
        ];
      default:
        return [];
    }
  };

  const handleTypeChange = (newType: CustomFieldType) => {
    setType(newType);
    setValidationRules(getDefaultValidationRules(newType));
    if (!['select', 'multi-select'].includes(newType)) {
      setOptions([]);
    }
  };

  const validateFieldName = (name: string): string[] => {
    const errors: string[] = [];
    
    if (name.length < 2) {
      errors.push("Field name must be at least 2 characters long");
    }
    
    if (name.length > 50) {
      errors.push("Field name must not exceed 50 characters");
    }
    
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
      errors.push("Field name must start with a letter and contain only letters, numbers, and underscores");
    }
    
    if (existingFields.some(field => field.name.toLowerCase() === name.toLowerCase())) {
      errors.push("A field with this name already exists");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameValidationErrors = validateFieldName(name);
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
            <div className="grid gap-2">
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Field Type</Label>
              <Select value={type} onValueChange={(value) => handleTypeChange(value as CustomFieldType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="multi-select">Multi Select</SelectItem>
                  <SelectItem value="rich-text">Rich Text</SelectItem>
                  <SelectItem value="file">File Attachment</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={required}
                onCheckedChange={setRequired}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
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
