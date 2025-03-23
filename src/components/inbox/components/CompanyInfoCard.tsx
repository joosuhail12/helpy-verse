
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Globe, Building, Users } from "lucide-react";
import type { Company } from "@/types/company";

interface CompanyInfoCardProps {
  company?: Company | string;
  isOpen: boolean;
  onToggle: () => void;
}

const CompanyInfoCard = ({ company, isOpen, onToggle }: CompanyInfoCardProps) => {
  if (!company) return null;
  
  // Convert string company to object if needed
  const companyObj = typeof company === 'string' 
    ? { 
        id: company, 
        name: company, 
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } 
    : company;

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="flex flex-row items-center justify-between cursor-pointer p-4 bg-gray-50"
        onClick={onToggle}
      >
        <div className="font-medium">Company Information</div>
        <div>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-4 pt-2 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{companyObj.name}</div>
          </div>
          
          {companyObj.website && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Website</div>
              <div className="flex items-center">
                <Globe size={14} className="mr-2 text-gray-500" />
                <a href={companyObj.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {companyObj.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          
          {'industry' in companyObj && companyObj.industry && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Industry</div>
              <div className="flex items-center">
                <Building size={14} className="mr-2 text-gray-500" />
                <span>{companyObj.industry}</span>
              </div>
            </div>
          )}
          
          {'numberOfEmployees' in companyObj && companyObj.numberOfEmployees && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Size</div>
              <div className="flex items-center">
                <Users size={14} className="mr-2 text-gray-500" />
                <span>{companyObj.numberOfEmployees} employees</span>
              </div>
            </div>
          )}
          
          {/* Additional company info could be rendered here */}
        </CardContent>
      )}
    </Card>
  );
};

export default CompanyInfoCard;
