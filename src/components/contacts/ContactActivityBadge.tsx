
import { format } from 'date-fns';
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquare, Clock } from 'lucide-react';

interface ContactActivityBadgeProps {
  contact: Contact;
}

export const ContactActivityBadge = ({ contact }: ContactActivityBadgeProps) => {
  // In a real app, these would come from the backend
  const communicationFrequency = contact.lastContacted ? 'medium' : 'low';
  const lastActivity = contact.updatedAt;

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'high':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="secondary"
              className={`${getFrequencyColor(communicationFrequency)} cursor-help`}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {communicationFrequency}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Communication frequency</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="cursor-help">
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(lastActivity), 'MMM d')}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last activity: {format(new Date(lastActivity), 'MMM d, yyyy')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
