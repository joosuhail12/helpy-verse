
import { Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Company } from '@/types/company';

interface CompanyListItemProps {
  company: Company;
}

export const CompanyListItem = ({ company }: CompanyListItemProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Building2 className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{company.name}</h4>
          <p className="text-sm text-gray-500">{company.website}</p>
        </div>
      </div>
    </Card>
  );
};
