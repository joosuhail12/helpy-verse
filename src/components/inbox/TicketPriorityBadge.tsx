
import { CircleAlert, Circle, CheckCircle } from 'lucide-react';

interface TicketPriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
}

const TicketPriorityBadge = ({ priority, size = 'md' }: TicketPriorityBadgeProps) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <CircleAlert className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-red-500`} />;
      case 'medium':
        return <Circle className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-amber-500`} />;
      case 'low':
        return <CheckCircle className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-blue-500`} />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
      priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
      priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
      'bg-blue-50 text-blue-700 border border-blue-200'
    } ${
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 
      size === 'lg' ? 'text-sm px-2.5 py-1.5' : 
      'text-xs px-2 py-1'
    }`}>
      {getPriorityIcon(priority)}
      {priority}
    </span>
  );
};

export default TicketPriorityBadge;
