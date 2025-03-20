
import React from 'react';
import { User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';

interface EmptyContactsStateProps {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (open: boolean) => void;
}

const EmptyContactsState: React.FC<EmptyContactsStateProps> = ({ isPopoverOpen, setIsPopoverOpen }) => {
  return (
    <div className="py-8 text-center border rounded-md bg-muted/20">
      <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
      <p className="text-muted-foreground mb-4">No contacts associated with this company</p>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Associate Contact
          </Button>
        </PopoverTrigger>
      </Popover>
    </div>
  );
};

export default EmptyContactsState;
