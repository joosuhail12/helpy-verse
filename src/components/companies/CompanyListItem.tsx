
import { Building2, Globe, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Company } from '@/types/company';
import { useNavigate } from 'react-router-dom';

interface CompanyListItemProps {
  company: Company;
}

export const CompanyListItem = ({ company }: CompanyListItemProps) => {
  const navigate = useNavigate();

  const getIndustryIcon = () => {
    switch (company.industry?.toLowerCase()) {
      case 'technology':
        return <Globe className="h-5 w-5 text-purple-600" />;
      default:
        return <Briefcase className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-all duration-300 hover:bg-purple-50/50 hover:border-purple-200 cursor-pointer group"
      onClick={() => navigate(`/home/contacts/companies/${company.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{company.name}</h4>
              <Badge 
                variant={company.status === 'active' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {company.status === 'active' ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    <span>Inactive</span>
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {company.website && (
                <p className="text-sm text-purple-600/70 hover:text-purple-700">{company.website}</p>
              )}
            </div>
          </div>
        </div>
        {company.industry && (
          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
            {getIndustryIcon()}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        {company.employeeCount && (
          <span>{company.employeeCount} employees</span>
        )}
        {company.location?.city && company.location?.country && (
          <span>{company.location.city}, {company.location.country}</span>
        )}
      </div>
    </Card>
  );
};
