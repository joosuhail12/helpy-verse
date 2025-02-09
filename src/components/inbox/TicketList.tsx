
import { Inbox, MessageSquare, User, Building, Tag, Search, Filter, Clock, UserX } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList = ({ tickets = [] }: TicketListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 animate-fade-in">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg border border-purple-100 p-4 hover:shadow-md transition-all cursor-pointer w-full"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{ticket.company}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{ticket.lastMessage}</p>
                  {ticket.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Tag className="w-4 h-4 text-gray-400" />
                      {ticket.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' :
                      ticket.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      ticket.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
                      ticket.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {ticket.assignee ? (
                    <>
                      <User className="w-4 h-4" />
                      <span>{ticket.assignee}</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-500 font-medium">Unassigned</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
