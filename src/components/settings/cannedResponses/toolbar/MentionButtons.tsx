
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building2, Ticket as TicketIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from '@/components/ui/tooltip-provider';

interface MentionButtonsProps {
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
  disabled?: boolean;
}

const MentionButtons = ({ onInsertPlaceholder, disabled = false }: MentionButtonsProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              onInsertPlaceholder('customer');
            }}
            disabled={disabled}
          >
            <User className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Insert Customer Placeholder</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              onInsertPlaceholder('company');
            }}
            disabled={disabled}
          >
            <Building2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Insert Company Placeholder</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              onInsertPlaceholder('ticket');
            }}
            disabled={disabled}
          >
            <TicketIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Insert Ticket Reference</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MentionButtons;
