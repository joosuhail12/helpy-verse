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
import type { CustomField, CustomFieldType, ValidationRule, FieldDependency } from "@/types/customField";
import ValidationRulesSection from "./ValidationRulesSection";
import DependenciesSection from "./DependenciesSection";

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
  const { toast } = useToast();
  const { addCustomField, isLoading } = useCustomDataMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const timestamp = new Date().toISOString();
      const historyEntry: FieldHistoryEntry = {
        id: Math.random().toString(),
        timestamp,
        userId: 'current-user', // In real app, get from auth
        userName: 'Current User', // In real app, get from auth
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
          history: [historyEntry]
        }
      });
      
      toast({
        title: "Custom field added",
        description: "The custom field has been added successfully.",
      });
      
      onClose();
      setName("");
      setType("text");
      setRequired(false);
      setDescription("");
      setValidationRules([]);
      setDependencies([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add custom field. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              <Select value={type} onValueChange={(value) => setType(value as CustomFieldType)}>
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
