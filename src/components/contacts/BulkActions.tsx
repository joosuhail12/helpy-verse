
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { StatusActions } from './bulk-actions/StatusActions';
import { TagActions } from './bulk-actions/TagActions';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearSelection } from '@/store/slices/contacts/contactsSlice';
import { Trash, X } from 'lucide-react';

const BulkActions = () => {
  const selectedContactIds = useAppSelector((state) => state.contacts?.selectedContacts || []);
  const contacts = useAppSelector((state) => state.contacts?.contacts || []);
  const dispatch = useAppDispatch();

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  if (selectedContactIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-10 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleClearSelection}>
            <X className="h-4 w-4 mr-2" />
            Clear selection ({selectedContactIds.length})
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <StatusActions selectedContactIds={selectedContactIds} />
          <TagActions selectedContactIds={selectedContactIds} contacts={contacts} />
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
