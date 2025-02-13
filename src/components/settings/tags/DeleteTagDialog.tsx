
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
  counts: {
    tickets: number;
    contacts: number;
    companies: number;
  };
}

interface DeleteTagDialogProps {
  tag: Tag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteTagDialog = ({ tag, open, onOpenChange }: DeleteTagDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const totalAssociations = tag.counts.tickets + tag.counts.contacts + tag.counts.companies;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Mock API call delay - in the future, this will be replaced with actual API call
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
            {totalAssociations > 0 && (
              <div className="mt-2 space-y-1 text-red-600">
                <p>This tag is currently used in:</p>
                <ul className="list-disc list-inside">
                  {tag.counts.tickets > 0 && (
                    <li>{tag.counts.tickets} {tag.counts.tickets === 1 ? 'ticket' : 'tickets'}</li>
                  )}
                  {tag.counts.contacts > 0 && (
                    <li>{tag.counts.contacts} {tag.counts.contacts === 1 ? 'contact' : 'contacts'}</li>
                  )}
                  {tag.counts.companies > 0 && (
                    <li>{tag.counts.companies} {tag.counts.companies === 1 ? 'company' : 'companies'}</li>
                  )}
                </ul>
              </div>
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
