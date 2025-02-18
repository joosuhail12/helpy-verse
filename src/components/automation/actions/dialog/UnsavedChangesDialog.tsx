
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesDialog = ({ isOpen, onConfirm, onCancel }: UnsavedChangesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discard Changes?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>You have unsaved changes. Are you sure you want to discard them?</p>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Discard Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
