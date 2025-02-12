
import { Badge } from "@/components/ui/badge";
import { UserCircle } from "lucide-react";
import type { Ticket } from "@/types/ticket";

interface CustomerHeaderProps {
  ticket: Ticket;
}

const CustomerHeader = ({ ticket }: CustomerHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Active
        </Badge>
      </div>
      <div className="flex items-center space-x-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <UserCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{ticket.customer}</p>
          <p className="text-sm text-gray-500">{ticket.company}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerHeader;
