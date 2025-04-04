
import { Company } from '@/types/company';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, Globe, Calendar, Phone, Mail, MapPin, Users, Banknote, Info } from 'lucide-react';
import { InlineEditField } from '@/components/companies/detail/InlineEditField';

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
              company={company.id}
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
              company={company.id}
              field="website"
              label="Website"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Info className="h-4 w-4" />
              <span>Industry</span>
            </div>
            <InlineEditField
              value={company.industry || ''}
              company={company.id}
              field="industry"
              label="Industry"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Users className="h-4 w-4" />
              <span>Employee Count</span>
            </div>
            <InlineEditField
              value={String(company.numberOfEmployees || '')}
              company={company.id}
              field="numberOfEmployees"
              label="Employee Count"
              type="number"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Banknote className="h-4 w-4" />
              <span>Annual Revenue</span>
            </div>
            <InlineEditField
              value={String(company.annualRevenue || '')}
              company={company.id}
              field="annualRevenue"
              label="Annual Revenue"
              type="number"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Info className="h-4 w-4" />
              <span>Description</span>
            </div>
            <InlineEditField
              value={company.description || ''}
              company={company.id}
              field="description"
              label="Description"
              type="rich-text"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <div className="space-y-2">
              <InlineEditField
                value={company.location?.street || ''}
                company={company.id}
                field="location.street"
                label="Street"
              />
              <InlineEditField
                value={company.location?.city || ''}
                company={company.id}
                field="location.city"
                label="City"
              />
              <InlineEditField
                value={company.location?.state || ''}
                company={company.id}
                field="location.state"
                label="State"
              />
              <InlineEditField
                value={company.location?.country || ''}
                company={company.id}
                field="location.country"
                label="Country"
              />
              <InlineEditField
                value={company.location?.zipcode || ''}
                company={company.id}
                field="location.zipcode"
                label="Postal Code"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </div>
            <InlineEditField
              value={company.phone || ''}
              company={company.id}
              field="phone"
              label="Phone"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <InlineEditField
              value={company.email || ''}
              company={company.id}
              field="email"
              label="Email"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
              <Globe className="h-4 w-4" />
              <span>Social Media</span>
            </div>
            <div className="space-y-2">
              <InlineEditField
                value={company.socialMedia?.linkedin || ''}
                company={company.id}
                field="socialMedia.linkedin"
                label="LinkedIn"
              />
              <InlineEditField
                value={company.socialMedia?.twitter || ''}
                company={company.id}
                field="socialMedia.twitter"
                label="Twitter"
              />
              <InlineEditField
                value={company.socialMedia?.facebook || ''}
                company={company.id}
                field="socialMedia.facebook"
                label="Facebook"
              />
            </div>
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
