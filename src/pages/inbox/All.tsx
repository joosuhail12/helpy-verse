
import TicketList from '@/components/inbox/TicketList';

const AllTickets = () => {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">All Tickets</h2>
      </div>
      
      <TicketList />
    </div>
  );
};

export default AllTickets;
