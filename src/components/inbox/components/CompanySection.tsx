
import { Building2, ChevronDown, Users, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Ticket } from "@/types/ticket";

interface CompanySectionProps {
  ticket: Ticket;
}

const CompanySection = ({ ticket }: CompanySectionProps) => {
  return (
    <Collapsible>
      <Card className="border shadow-sm">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium">Company</h3>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4">
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500">Company Details</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Company Name</span>
                  <span className="text-gray-600">{ticket.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Industry</span>
                  <span className="text-gray-600">Technology</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Users</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">50+</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Customer Since</span>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">March 2024</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">New ticket created</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">User added</span>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </section>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompanySection;
