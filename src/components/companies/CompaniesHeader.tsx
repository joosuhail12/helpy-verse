
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import CreateCompanyDialog from './CreateCompanyDialog';

export const CompaniesHeader = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all companies in your system
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
};
