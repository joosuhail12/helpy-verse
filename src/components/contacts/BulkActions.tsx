
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { StatusActions } from './bulk-actions/StatusActions';
import { TagActions } from './bulk-actions/TagActions';

const BulkActions = () => {
  const { selectedContacts, contacts } = useAppSelector((state) => state.contacts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (selectedContacts.length === 0) {
    return null;
  }

  return (
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
    </div>
  );
};

export default BulkActions;
