
import { Company } from '@/types/company';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

interface CompanyPreferencesProps {
  company: Company;
}

export const CompanyPreferences = ({ company }: CompanyPreferencesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-500">Preferences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Preferred Language</p>
          <InlineEditField
            value={company.preferredLanguage || ''}
            company={company.id}
            field="preferredLanguage"
            label="Preferred Language"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Timezone</p>
          <InlineEditField
            value={company.timezone || ''}
            company={company.id}
            field="timezone"
            label="Timezone"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Business Model</p>
          <InlineEditField
            value={company.businessModel || ''}
            company={company.id}
            field="businessModel"
            label="Business Model"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Market Segment</p>
          <InlineEditField
            value={company.marketSegment || ''}
            company={company.id}
            field="marketSegment"
            label="Market Segment"
          />
        </div>
      </div>
    </div>
  );
};
