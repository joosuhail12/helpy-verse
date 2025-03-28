
import { Company } from '@/types/company';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';
import { formatDistanceToNow } from 'date-fns';

interface CompanyDatesInfoProps {
  company: Company;
}

export const CompanyDatesInfo = ({ company }: CompanyDatesInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-500">Dates</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Founded Year</p>
          <InlineEditField
            value={company.foundedYear?.toString() || ''}
            companyId={company.id}
            field="foundedYear"
            label="Founded Year"
            type="number"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Created At</p>
          <p className="text-sm text-gray-600">
            {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Updated At</p>
          <p className="text-sm text-gray-600">
            {company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
          <p className="text-sm text-gray-600">
            {company.lastActivity ? 
              `${formatDistanceToNow(new Date(company.lastActivity))} ago` : 
              'No activity recorded'}
          </p>
        </div>
      </div>
    </div>
  );
};
