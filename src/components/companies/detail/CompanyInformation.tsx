
import { Company } from '@/types/company';
import { Activity } from '@/types/activity';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { CompanyStatusInfo } from './info/CompanyStatusInfo';
import { CompanyBasicInfo } from './info/CompanyBasicInfo';
import { CompanyContactInfo } from './info/CompanyContactInfo';
import { CompanyLocationInfo } from './info/CompanyLocationInfo';
import { CompanyDatesInfo } from './info/CompanyDatesInfo';
import { CompanyCustomFields } from './CompanyCustomFields';
import { CompanySocialInfo } from './info/CompanySocialInfo';
import { CompanyPreferences } from './info/CompanyPreferences';

interface CompanyInformationProps {
  company: Company;
  activities: Activity[];
}

export const CompanyInformation = ({ company, activities }: CompanyInformationProps) => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5 transition-all duration-300 hover:shadow-purple-500/10">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Company Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <CompanyStatusInfo company={company} />
        <CompanyBasicInfo company={company} />
        <CompanyContactInfo company={company} />
        <CompanyLocationInfo company={company} />
        <CompanySocialInfo company={company} />
        <CompanyPreferences company={company} />
        <CompanyDatesInfo company={company} />
        <CompanyCustomFields company={company} />
      </CardContent>
    </Card>
  );
};
