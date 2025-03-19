
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TicketFormContainer from './TicketFormContainer';
import type { CreateTicketDialogProps } from './types';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateTicketDialog = ({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Ticket</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <TicketFormContainer 
            onTicketCreated={onTicketCreated}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
