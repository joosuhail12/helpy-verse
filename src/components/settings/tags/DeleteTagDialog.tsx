
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
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface DeleteTagDialogProps {
  tag: Tag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteTagDialog = ({ tag, open, onOpenChange }: DeleteTagDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Tag deleted",
        description: `Successfully deleted tag "${tag.name}"`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag "{tag.name}"? This action cannot be undone.
            {tag.count > 0 && (
              <span className="block mt-2 text-red-600">
                This tag is currently used in {tag.count} {tag.count === 1 ? 'ticket' : 'tickets'}.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTagDialog;
