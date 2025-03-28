
import { Company } from '@/types/company';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

interface CompanyLocationInfoProps {
  company: Company;
}

export const CompanyLocationInfo = ({ company }: CompanyLocationInfoProps) => {
  const location = company.location || {};
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-500">Location</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Street</p>
          <InlineEditField
            value={location.street || ''}
            company={company.id}
            field="location.street"
            label="Street"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">City</p>
          <InlineEditField
            value={location.city || ''}
            company={company.id}
            field="location.city"
            label="City"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">State</p>
          <InlineEditField
            value={location.state || ''}
            company={company.id}
            field="location.state"
            label="State"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Zipcode</p>
          <InlineEditField
            value={location.zipcode || ''}
            company={company.id}
            field="location.zipcode"
            label="Zipcode"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Country</p>
          <InlineEditField
            value={location.country || ''}
            company={company.id}
            field="location.country"
            label="Country"
          />
        </div>
      </div>
    </div>
  );
};
