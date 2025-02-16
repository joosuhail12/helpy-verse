
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Ticket, MessageCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdated: string;
  contactName: string;
  contactEmail: string;
}

interface CompanyTicketsProps {
  companyId: string;
}

export const CompanyTickets = ({ companyId }: CompanyTicketsProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data for tickets
  const mockTickets: Ticket[] = [
    {
      id: '1',
      subject: 'Integration Issue with API',
      status: 'open',
      priority: 'high',
      createdAt: new Date(2024, 2, 1).toISOString(),
      lastUpdated: new Date(2024, 2, 15).toISOString(),
      contactName: 'John Doe',
      contactEmail: 'john@acme.com'
    },
    {
      id: '2',
      subject: 'Billing Question',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(2024, 2, 10).toISOString(),
      lastUpdated: new Date(2024, 2, 15).toISOString(),
      contactName: 'Jane Smith',
      contactEmail: 'jane@acme.com'
    },
  ];

  const filteredTickets = mockTickets.filter(
    ticket => statusFilter === 'all' || ticket.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Tickets</CardTitle>
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <ScrollArea className="h-[600px]">
        <CardContent>
          <div className="space-y-4 mt-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <h3 className="font-medium">{ticket.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(ticket.status)} variant="secondary">
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Contact: {ticket.contactName} ({ticket.contactEmail})</p>
                  <div className="flex items-center gap-4">
                    <span>Created: {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                    <span>Updated: {format(new Date(ticket.lastUpdated), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No tickets found</p>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

