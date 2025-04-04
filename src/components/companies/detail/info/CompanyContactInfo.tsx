
import { Company } from '@/types/company';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

interface CompanyContactInfoProps {
  company: Company;
}

export const CompanyContactInfo = ({ company }: CompanyContactInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-500">Contact Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <InlineEditField
            value={company.email || ''}
            company={company.id}
            field="email"
            label="Email"
            type="email"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Phone</p>
          <InlineEditField
            value={company.phone || ''}
            company={company.id}
            field="phone"
            label="Phone"
            type="phone"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Website</p>
          <InlineEditField
            value={company.website || ''}
            company={company.id}
            field="website"
            label="Website"
            type="url"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Main Contact</p>
          <InlineEditField
            value={company.mainContact || ''}
            company={company.id}
            field="mainContact"
            label="Main Contact"
          />
        </div>
      </div>
    </div>
  );
};
