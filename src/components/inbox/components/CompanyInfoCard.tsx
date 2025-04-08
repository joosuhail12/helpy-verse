import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building2, ChevronUp, ChevronDown } from "lucide-react";
import { Company } from "@/types/company";
import { InlineEditField } from "@/components/companies/detail/InlineEditField";

interface CompanyInfoCardProps {
  isOpen: boolean;
  onToggle: () => void;
  company?: Company | null;
}

const CompanyInfoCard = ({ isOpen, onToggle, company = null }: CompanyInfoCardProps) => {
  // Default values for display when no company is available
  const defaultPlan = "Enterprise";
  const defaultStatus = "active";
  const defaultCustomerSince = "March 2024";

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
              <span className="text-gray-500">Plan</span>
              {company?.id ? (
                <InlineEditField
                  value={company.tierLevel || defaultPlan}
                  companyId={company.id}
                  field="tierLevel"
                  label="Plan"
                  type="select"
                  options={['bronze', 'silver', 'gold', 'platinum']}
                />
              ) : (
                <Badge variant="secondary">
                  {defaultPlan || (company?.tierLevel === 'platinum' ? 'Enterprise' : company?.tierLevel)}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              {company?.id ? (
                <InlineEditField
                  value={company.status || defaultStatus}
                  companyId={company.id}
                  field="status"
                  label="Status"
                  type="select"
                  options={['active', 'inactive']}
                />
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {defaultStatus.charAt(0).toUpperCase() + defaultStatus.slice(1)}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Customer Since</span>
              {company?.id ? (
                <InlineEditField
                  value={company.foundedYear ? String(company.foundedYear) : defaultCustomerSince}
                  companyId={company.id}
                  field="foundedYear"
                  label="Customer Since"
                />
              ) : (
                <span className="text-gray-600">{defaultCustomerSince}</span>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanyInfoCard;
