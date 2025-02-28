
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trash2, Share2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/types/company';

export interface CompanyDetailHeaderProps {
  company: Company;
  onDeleteClick: () => void;
}

export const CompanyDetailHeader = ({ company, onDeleteClick }: CompanyDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home/contacts/companies')}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">{company.name}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={onDeleteClick}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
