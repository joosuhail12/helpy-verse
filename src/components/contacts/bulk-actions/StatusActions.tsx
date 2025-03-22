
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact, clearSelection } from '@/store/slices/contacts/contactsSlice';
import { AlignCenter, Check, ChevronDown } from 'lucide-react';

interface StatusActionsProps {
  selectedContactIds: string[];
}

export const StatusActions: React.FC<StatusActionsProps> = ({ selectedContactIds }) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleSetStatus = async (status: 'active' | 'inactive') => {
    try {
      // Update each contact
      for (const contactId of selectedContactIds) {
        await dispatch(updateContact({
          contactId,
          data: { status }
        })).unwrap();
      }

<<<<<<< HEAD
      toast({
        title: "Status updated",
        description: `Updated ${selectedContactIds.length} contacts to ${status}`,
      });
=======
    selectedContacts.forEach(contactId => {
      dispatch(updateContact({
        id: contactId,
        data: { status: selectedStatus as 'active' | 'inactive' }
      }));
    });
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)

      dispatch(clearSelection());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      });
    }
  };

  if (selectedContactIds.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Set Status <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSetStatus('active')}>
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Mark as Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetStatus('inactive')}>
          <AlignCenter className="mr-2 h-4 w-4 text-gray-500" />
          Mark as Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
