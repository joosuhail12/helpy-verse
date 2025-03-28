
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';
import { BulkActions } from './BulkActions';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectSelectedContactIds } from '@/store/slices/contacts/contactsSlice';

interface ContactListControlsProps {}

export const ContactListControls: React.FC<ContactListControlsProps> = () => {
  const selectedContactIds = useAppSelector(selectSelectedContactIds);
  const hasSelection = selectedContactIds.length > 0;
  
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  return (
    <div className="bg-white p-4 rounded-md shadow">
      {hasSelection && showBulkActions ? (
        <BulkActions onCancel={() => setShowBulkActions(false)} />
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Search contacts..." 
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
          </div>
          
          <div className="flex gap-2">
            {hasSelection && (
              <Button variant="outline" onClick={() => setShowBulkActions(true)}>
                Actions ({selectedContactIds.length})
              </Button>
            )}
            <Button>
              <Plus className="mr-2" size={18} />
              Add Contact
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
