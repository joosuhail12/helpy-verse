
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

interface CompanyListItemProps {
  company: any;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export const CompanyListItem: React.FC<CompanyListItemProps> = ({ 
  company, 
  isSelected, 
  onToggleSelect 
}) => {
  const handleToggleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSelect(company.id);
  };

  return (
    <li className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
      <Link to={`/companies/${company.id}`} className="flex items-center gap-4">
        <div onClick={handleToggleSelect}>
          <Checkbox checked={isSelected} />
        </div>
        
        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {company.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {company.industry || 'No industry'} • {company.location || 'No location'}
          </p>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {company.contacts ? `${company.contacts} contacts` : 'No contacts'}
        </div>
      </Link>
    </li>
  );
};
