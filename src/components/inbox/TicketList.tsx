
import { Inbox } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface TicketListProps {
  tickets?: Ticket[];
}

const TicketList = ({ tickets = [] }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white/50 backdrop-blur-sm rounded-lg border border-purple-100">
        <div className="text-center max-w-md mx-auto p-6 space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center">
            <Inbox className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No tickets yet</h3>
          <p className="text-gray-500">
            When customers reach out for support, their tickets will appear here. You'll be able to manage and respond to them from this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-purple-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.subject}</TableCell>
              <TableCell>{ticket.customer}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {ticket.priority}
                </span>
              </TableCell>
              <TableCell className="text-gray-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketList;
