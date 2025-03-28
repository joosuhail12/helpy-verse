import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCompany, deleteCompany } from '@/store/slices/companies/companiesSlice';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/types/company';

interface CompanyDetailSidebarProps {
  company: Company;
}

export const CompanyDetailSidebar = ({ company }: CompanyDetailSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateCompany = async () => {
    try {
      await dispatch(updateCompany({
        companyId: company.id,
        data: { 
          status: company.status === 'active' ? 'inactive' : 'active' 
        }
      }));
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const handleDeleteCompany = async () => {
    if (isDeleting) return;
    
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      setIsDeleting(true);
      try {
        await dispatch(deleteCompany(company.id));
        navigate('/contacts/companies');
      } catch (error) {
        console.error('Failed to delete company:', error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleUpdateCompany}
          >
            {company.status === 'active' ? 'Deactivate' : 'Activate'} Company
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={handleDeleteCompany}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Company'}
          </Button>
        </CardContent>
      </Card>

      {/* Additional sidebar cards can go here */}
    </div>
  );
};
