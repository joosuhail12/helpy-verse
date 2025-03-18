
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
import type { CustomObjectField } from "@/types/customObject";
import { customObjectService } from "@/api/services/customObject.service";

interface DeleteCustomFieldDialogProps {
    isOpen: boolean;
    onClose: () => void;
    field: CustomObjectField;
    customObjectId: string;
}

const DeleteCustomObjectsFieldDialog = ({
    isOpen,
    onClose,
    field,
    customObjectId,
}: DeleteCustomFieldDialogProps) => {
    const { toast } = useToast();

    const deleteCustomField = async (data: { fieldId: string }) => {
        try {
            const response = await customObjectService.deleteCustomObjectField(customObjectId, data.fieldId);
            return response;
        } catch (error) {
            console.error("Error deleting custom field", error);
            throw new Error("Failed to delete custom field");
        }
    }

    const handleDelete = async () => {
        try {
            await deleteCustomField({ fieldId: field.id });
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

export default DeleteCustomObjectsFieldDialog;
