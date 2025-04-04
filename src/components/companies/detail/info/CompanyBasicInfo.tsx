
import { Company } from '@/types/company';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

interface CompanyBasicInfoProps {
  company: Company;
}

export const CompanyBasicInfo = ({ company }: CompanyBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Company Name</p>
        <InlineEditField
          value={company.name}
          company={company.id}
          field="name"
          label="Company Name"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Industry</p>
        <InlineEditField
          value={company.industry || ''}
          company={company.id}
          field="industry"
          label="Industry"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Employees</p>
        <InlineEditField
          value={company.numberOfEmployees?.toString() || ''}
          company={company.id}
          field="numberOfEmployees"
          label="Employees"
          type="number"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
        <InlineEditField
          value={company.annualRevenue?.toString() || ''}
          company={company.id}
          field="annualRevenue"
          label="Annual Revenue"
          type="number"
        />
      </div>
    </div>
  );
};
