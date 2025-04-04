
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Trash2, Tag, Download, UserCheck, UserMinus } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectSelectedContactIds } from '@/store/slices/contacts/contactsSelectors';

interface BulkActionsProps {
  onCancel: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({ onCancel }) => {
  const selectedContactIds = useAppSelector(selectSelectedContactIds);
  
  const selectedCount = selectedContactIds.length;
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-sm font-medium mr-2">
        {selectedCount} {selectedCount === 1 ? 'contact' : 'contacts'} selected
      </div>
      
      <Button variant="outline" size="sm" className="h-8">
        <Tag className="mr-1 h-4 w-4" />
        Add Tags
      </Button>
      
      <Button variant="outline" size="sm" className="h-8">
        <UserCheck className="mr-1 h-4 w-4" />
        Set Status
      </Button>
      
      <Button variant="outline" size="sm" className="h-8">
        <Download className="mr-1 h-4 w-4" />
        Export
      </Button>
      
      <Button variant="outline" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="mr-1 h-4 w-4" />
        Delete
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-auto h-8" 
        onClick={onCancel}
      >
        <X className="mr-1 h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
};
