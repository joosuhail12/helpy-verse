
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import TicketFormContainer from './TicketFormContainer';
import type { CreateTicketDialogProps } from './types';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateTicketDialog = ({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl border-none shadow-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              <h2 className="text-xl font-semibold tracking-tight">Create New Ticket</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 pt-4 overflow-y-auto">
          <TicketFormContainer 
            onClose={() => onOpenChange(false)}
            onTicketCreated={onTicketCreated}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
