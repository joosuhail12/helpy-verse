
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';

interface TicketPriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

const TicketPriorityBadge = ({ priority, size = 'md' }: TicketPriorityBadgeProps) => {
  const getIconByPriority = () => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
      case 'medium':
        return <AlertCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
      case 'low':
        return <Clock className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
      priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
      priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
      'bg-blue-50 text-blue-700 border border-blue-200'
    } ${
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 
      size === 'lg' ? 'text-sm px-2.5 py-1.5' : 
      'text-xs px-2 py-1'
    }`}>
      {getIconByPriority()}
      <span>{priority}</span>
    </span>
  );
};

export default TicketPriorityBadge;
