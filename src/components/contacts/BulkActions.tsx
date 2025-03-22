
<<<<<<< HEAD
import React from 'react';
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
=======
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { StatusActions } from './bulk-actions/StatusActions';
import { TagActions } from './bulk-actions/TagActions';

const BulkActions = () => {
  const { selectedContacts, contacts } = useAppSelector((state) => state.contacts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (selectedContacts.length === 0) {
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
    return null;
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3 flex flex-wrap gap-3 items-center mt-4">
      <div className="font-medium text-sm text-gray-700">
        {selectedContacts.length} {selectedContacts.length === 1 ? 'contact' : 'contacts'} selected
      </div>
      
      <div className="flex flex-wrap gap-3 items-center ml-auto">
        <StatusActions selectedContacts={selectedContacts} />
        <TagActions selectedContacts={selectedContacts} contacts={contacts} />
        
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>
      
      {/* Delete confirmation dialog would go here */}
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
    </div>
  );
};

export default BulkActions;
