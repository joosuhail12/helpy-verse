
interface TicketStatusBadgeProps {
  status: 'open' | 'closed' | 'pending';
}

const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
      status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' :
      status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
      'bg-gray-50 text-gray-700 border border-gray-200'
    }`}>
      {status}
    </span>
  );
};

export default TicketStatusBadge;
