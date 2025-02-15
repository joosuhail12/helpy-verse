
import { Company } from '@/types/company';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, Globe, Calendar } from 'lucide-react';
import { InlineEditField } from '@/components/contacts/detail/InlineEditField';

interface CompanyMainInfoProps {
  company: Company;
}

export const CompanyMainInfo = ({ company }: CompanyMainInfoProps) => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Company Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Building2 className="h-4 w-4" />
              <span>Company Name</span>
            </div>
            <InlineEditField
              value={company.name}
              contactId={company.id}
              field="name"
              label="Company Name"
              validation={[{ type: 'required', value: '', message: 'Company name is required' }]}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Globe className="h-4 w-4" />
              <span>Website</span>
            </div>
            <InlineEditField
              value={company.website || ''}
              contactId={company.id}
              field="website"
              label="Website"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <span>Industry</span>
            </div>
            <InlineEditField
              value={company.industry || ''}
              contactId={company.id}
              field="industry"
              label="Industry"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <span>Employee Count</span>
            </div>
            <InlineEditField
              value={String(company.employeeCount || '')}
              contactId={company.id}
              field="employeeCount"
              label="Employee Count"
              type="number"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Calendar className="h-4 w-4" />
              <span>Created At</span>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Calendar className="h-4 w-4" />
              <span>Last Updated</span>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(company.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
