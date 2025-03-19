
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building2, ChevronUp, ChevronDown, Globe, Users, DollarSign, Calendar } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { InlineEditField } from "@/components/companies/detail/InlineEditField";

interface CompanyInfoCardProps {
  company: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CompanyInfoCard = ({ company, isOpen, onToggle }: CompanyInfoCardProps) => {
  const { toast } = useToast();
  const mockCompanyId = "mock-company-id";

  // This would typically be fetched from the API or redux store
  const companyData = {
    id: mockCompanyId,
    name: company,
    website: `${company.toLowerCase()}.com`,
    employees: '250-500',
    revenue: '$50M - $100M',
    founded: '2015',
    customerSince: 'March 2024'
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Company Information</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Company Name</span>
              <InlineEditField
                value={companyData.name}
                companyId={mockCompanyId}
                field="name"
                label="Company Name"
                validation={[{ type: 'required', value: '', message: 'Company name is required' }]}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Plan</span>
              <Badge variant="secondary">Enterprise</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Customer Since</span>
              <InlineEditField
                value={companyData.customerSince}
                companyId={mockCompanyId}
                field="customerSince"
                label="Customer Since"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Website</span>
              </div>
              <InlineEditField
                value={companyData.website}
                companyId={mockCompanyId}
                field="website"
                label="Website"
                type="url"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Employees</span>
              </div>
              <InlineEditField
                value={companyData.employees}
                companyId={mockCompanyId}
                field="employees"
                label="Employees"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Revenue</span>
              </div>
              <InlineEditField
                value={companyData.revenue}
                companyId={mockCompanyId}
                field="revenue"
                label="Revenue"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Founded</span>
              </div>
              <InlineEditField
                value={companyData.founded}
                companyId={mockCompanyId}
                field="founded"
                label="Founded"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanyInfoCard;
