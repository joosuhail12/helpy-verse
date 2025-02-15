
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const ContactsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">All Contacts</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and view all your contacts in one place
        </p>
      </div>
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Contact
      </Button>
    </div>
  );
};
