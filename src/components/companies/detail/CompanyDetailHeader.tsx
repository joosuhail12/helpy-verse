
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/company';

export interface CompanyDetailHeaderProps {
  company: Company;
  onDeleteClick: () => void;
}

export const CompanyDetailHeader: React.FC<CompanyDetailHeaderProps> = ({ company, onDeleteClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/contacts/companies');
  };

  return (
    <header className="bg-white border-b p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">{company.name}</h1>
          {company.status === 'inactive' && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
              Inactive
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDeleteClick}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </header>
  );
};
