
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Trash2 } from 'lucide-react';
import { Company } from '@/types/company';

interface CompanyDetailHeaderProps {
  company: Company;
  onDeleteClick: () => void;
}

export const CompanyDetailHeader = ({ company, onDeleteClick }: CompanyDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-purple-100/20 pb-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home/contacts/companies')}
          className="mt-1 hover:bg-purple-50/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-purple-600" />
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Company
        </Button>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="p-4 bg-purple-100 rounded-lg">
          <Building2 className="h-8 w-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {company.name}
          </h1>
          <p className="text-sm text-purple-600/70 mt-1">
            {company.website}
          </p>
        </div>
      </div>
    </div>
  );
};
