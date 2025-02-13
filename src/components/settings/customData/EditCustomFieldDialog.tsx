
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import type { CustomField } from "@/types/customField";
import { useCustomDataMutations } from "@/hooks/useCustomDataMutations";

interface EditCustomFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField;
  table: 'tickets' | 'contacts' | 'companies';
}

const EditCustomFieldDialog = ({
  isOpen,
  onClose,
  field,
  table,
}: EditCustomFieldDialogProps) => {
  const [name, setName] = useState(field.name);
  const [required, setRequired] = useState(field.required);
  const [description, setDescription] = useState(field.description);
  const { toast } = useToast();
  const { updateCustomField, isLoading } = useCustomDataMutations();

  useEffect(() => {
    if (isOpen) {
      setName(field.name);
      setRequired(field.required);
      setDescription(field.description);
    }
  }, [isOpen, field]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateCustomField({
        table,
        fieldId: field.id,
        updates: {
          name,
          required,
          description,
        }
      });
      
      toast({
        title: "Custom field updated",
        description: "The custom field has been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update custom field. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Custom Field</DialogTitle>
            <DialogDescription>
              Modify the custom field settings. Note that the field type cannot be
              changed after creation.
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
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomFieldDialog;
