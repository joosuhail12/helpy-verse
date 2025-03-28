
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearSelectedCompanies } from '@/store/slices/companies/companiesSlice';
import { selectSelectedCompanyIds } from '@/store/slices/companies/selectors';

export const CompaniesListControls = () => {
  const dispatch = useAppDispatch();
  const selectedCompanyIds = useAppSelector(selectSelectedCompanyIds);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  const handleClearSelection = () => {
    dispatch(clearSelectedCompanies());
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-auto max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          className="pl-8 w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        {selectedCompanyIds.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearSelection}
            size="sm"
          >
            Clear selection ({selectedCompanyIds.length})
          </Button>
        )}

        <Button
          onClick={() => setShowCreateDialog(true)}
        >
          Add Company
        </Button>
      </div>

      {/* We need to implement CreateCompanyDialog */}
    </div>
  );
};
