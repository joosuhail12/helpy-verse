
import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

interface StatusActionsProps {
  selectedContacts: string[];
}

export const StatusActions = ({ selectedContacts }: StatusActionsProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;

    selectedContacts.forEach(contactId => {
      dispatch(updateContact({
        id: contactId,
        status: selectedStatus as 'active' | 'inactive'
      }));
    });

    toast({
      title: "Status updated",
      description: `Updated status for ${selectedContacts.length} contacts`,
    });
    setSelectedStatus('');
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Update status..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleStatusUpdate}
        disabled={selectedContacts.length === 0 || !selectedStatus}
      >
        <UserCheck className="h-4 w-4 mr-2" />
        Update Status
      </Button>
    </div>
  );
};

