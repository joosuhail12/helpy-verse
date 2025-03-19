
import { Badge } from "@/components/ui/badge";
import { UserCircle } from "lucide-react";

interface CustomerHeaderProps {
  customer: string;
  company: string;
}

const CustomerHeader = ({ customer, company }: CustomerHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <div className="text-lg font-semibold text-gray-900">Details</div>
    </div>
  );
};

export default CustomerHeader;
