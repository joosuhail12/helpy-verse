
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TicketFormContainer from './TicketFormContainer';

interface CreateTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTicketDialog = ({ isOpen, onClose }: CreateTicketDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        <TicketFormContainer 
          onClose={onClose} 
          onTicketCreated={(ticket) => {
            console.log('Ticket created:', ticket);
            onClose();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
