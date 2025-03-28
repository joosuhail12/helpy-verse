
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
    website: `${company.toLowerCase().replace(/\s+/g, '')}.com`,
    employees: '250-500',
    revenue: '$50M - $100M',
    founded: '2015',
    customerSince: 'March 2024'
  };

  const handleFieldSave = (field: string, value: string) => {
    toast({
      title: "Field updated",
      description: `${field} has been successfully updated.`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group">
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg group-data-[state=closed]:rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Company Information</span>
            </div>
            {isOpen ? 
              <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" /> : 
              <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="space-y-3 text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Company Name</span>
              <InlineEditField
                value={companyData.name}
                company={mockCompanyId}
                field="name"
                label="Company Name"
                validation={[{ type: 'required', value: '', message: 'Company name is required' }]}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Plan</span>
              <Badge variant="secondary" className="text-xs transition-all hover:bg-secondary/80">Enterprise</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs transition-colors">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Domain</span>
              <InlineEditField
                value={companyData.website}
                company={mockCompanyId}
                field="website"
                label="Domain"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Website</span>
              </div>
              <InlineEditField
                value={companyData.website}
                company={mockCompanyId}
                field="website"
                label="Website"
                type="url"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Employees</span>
              </div>
              <InlineEditField
                value={companyData.employees}
                company={mockCompanyId}
                field="employees"
                label="Employees"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Revenue</span>
              </div>
              <InlineEditField
                value={companyData.revenue}
                company={mockCompanyId}
                field="revenue"
                label="Revenue"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Founded</span>
              </div>
              <InlineEditField
                value={companyData.founded}
                company={mockCompanyId}
                field="founded"
                label="Founded"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Customer Since</span>
              </div>
              <InlineEditField
                value={companyData.customerSince}
                company={mockCompanyId}
                field="customerSince"
                label="Customer Since"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanyInfoCard;
