
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { CannedResponse } from '@/mock/cannedResponses';

interface DeleteResponseDialogProps {
  open: boolean;  // Changed from isOpen to open
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  responseTitle: string;  // Changed to directly accept the title
}

export const DeleteResponseDialog = ({ 
  open, 
  onOpenChange, 
  onDelete,
  responseTitle
}: DeleteResponseDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDelete('dummy-id'); // Since we don't have a response object anymore
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the canned response "{responseTitle}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
