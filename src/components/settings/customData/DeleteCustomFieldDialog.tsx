
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import type { CustomField } from "@/types/customField";
import { useCustomDataMutations } from "@/hooks/useCustomDataMutations";

interface DeleteCustomFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField;
  table: 'tickets' | 'contacts' | 'companies';
}

const DeleteCustomFieldDialog = ({
  isOpen,
  onClose,
  field,
  table,
}: DeleteCustomFieldDialogProps) => {
  const { toast } = useToast();
  const { deleteCustomField } = useCustomDataMutations();

  const handleDelete = async () => {
    try {
      await deleteCustomField({ table, fieldId: field.id });
      toast({
        title: "Custom field deleted",
        description: "The custom field has been deleted successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete custom field. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Custom Field</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the custom field "{field.name}"? This
            action cannot be undone and may affect existing data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCustomFieldDialog;
