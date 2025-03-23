
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/ticket";
import type { Company } from "@/types/company";

interface CustomerHeaderProps {
  customer: Customer | string;
  company?: Company | string;
}

const CustomerHeader = ({ customer, company }: CustomerHeaderProps) => {
  // Convert string customer to object if needed
  const customerObj = typeof customer === 'string' 
    ? { id: customer, name: customer, email: `${customer.toLowerCase().replace(/\s+/g, '.')}@example.com` } 
    : customer;
  
  // Convert string company to object if needed
  const companyObj = company && typeof company === 'string'
    ? { id: company, name: company }
    : company;

  return (
    <div className="flex items-center space-x-4 p-4 border-b bg-white">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {customerObj.name ? customerObj.name.charAt(0).toUpperCase() : '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold truncate">{customerObj.name}</h2>
        <div className="flex items-center text-sm text-gray-500">
          {companyObj && (
            <>
              <span className="truncate">{companyObj.name}</span>
              <span className="mx-2">•</span>
            </>
          )}
          <span className="truncate">{customerObj.email}</span>
        </div>
      </div>
      
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Customer
      </Badge>
    </div>
  );
};

export default CustomerHeader;
