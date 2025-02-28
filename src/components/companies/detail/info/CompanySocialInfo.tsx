
import { Company } from '@/types/company';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

interface CompanySocialInfoProps {
  company: Company;
}

export const CompanySocialInfo = ({ company }: CompanySocialInfoProps) => {
  const socialMedia = company.socialMedia || {};
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-500">Social Media</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
          <InlineEditField
            value={socialMedia.linkedin || ''}
            companyId={company.id}
            field="socialMedia.linkedin"
            label="LinkedIn"
            type="url"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Twitter</p>
          <InlineEditField
            value={socialMedia.twitter || ''}
            companyId={company.id}
            field="socialMedia.twitter"
            label="Twitter"
            type="url"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Facebook</p>
          <InlineEditField
            value={socialMedia.facebook || ''}
            companyId={company.id}
            field="socialMedia.facebook"
            label="Facebook"
            type="url"
          />
        </div>
      </div>
    </div>
  );
};
