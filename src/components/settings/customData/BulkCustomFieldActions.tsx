
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CustomField } from "@/types/customField";
import { useCustomDataMutations } from "@/hooks/useCustomDataMutations";

interface BulkCustomFieldActionsProps {
  selectedFields: CustomField[];
  table: 'tickets' | 'contacts' | 'companies';
  onSelectionChange: (fields: CustomField[]) => void;
}

const BulkCustomFieldActions = ({
  selectedFields,
  table,
  onSelectionChange,
}: BulkCustomFieldActionsProps) => {
  const [isRequiredDialogOpen, setIsRequiredDialogOpen] = useState(false);
  const [bulkRequired, setBulkRequired] = useState(false);
  const { toast } = useToast();
  const { updateCustomField, isLoading } = useCustomDataMutations();

  const handleBulkRequiredUpdate = async () => {
    try {
      await Promise.all(
        selectedFields.map((field) =>
          updateCustomField({
            table,
            fieldId: field.id,
            updates: { required: bulkRequired },
          })
        )
      );

      toast({
        title: "Fields updated",
        description: `Successfully updated ${selectedFields.length} fields.`,
      });

      setIsRequiredDialogOpen(false);
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fields. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    // Implement bulk delete logic here
    toast({
      title: "Coming soon",
      description: "Bulk delete will be implemented in the next update.",
    });
  };

  if (selectedFields.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Bulk Actions ({selectedFields.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsRequiredDialogOpen(true)}>
            Set Required Status
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleBulkDelete}
            className="text-red-600"
          >
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRequiredDialogOpen} onOpenChange={setIsRequiredDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Required Status</DialogTitle>
            <DialogDescription>
              Update the required status for {selectedFields.length} selected fields.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Switch
              id="required"
              checked={bulkRequired}
              onCheckedChange={setBulkRequired}
            />
            <Label htmlFor="required">Make fields required</Label>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRequiredDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkRequiredUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Fields"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkCustomFieldActions;
