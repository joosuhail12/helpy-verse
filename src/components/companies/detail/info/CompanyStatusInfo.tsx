
import { Company } from '@/types/company';
import { Badge } from '@/components/ui/badge';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

interface CompanyStatusInfoProps {
  company: Company;
}

export const CompanyStatusInfo = ({ company }: CompanyStatusInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Company Type</p>
        <Badge 
          variant={company.type === 'customer' ? 'default' : 'secondary'}
          className="mt-1"
        >
          {company.type || 'Not specified'}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        <Badge 
          variant={company.status === 'active' ? 'default' : 'outline'}
          className={`mt-1 ${
            company.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {company.status || 'Not specified'}
        </Badge>
      </div>
    </div>
  );
};
