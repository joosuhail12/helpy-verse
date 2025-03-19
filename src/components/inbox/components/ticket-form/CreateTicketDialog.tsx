
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TicketFormContainer from './TicketFormContainer';
import type { CreateTicketDialogProps } from './types';

const CreateTicketDialog = ({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        
        <TicketFormContainer 
          onTicketCreated={onTicketCreated}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
