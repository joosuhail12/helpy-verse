
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building2, Ticket as TicketIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MentionButtonsProps {
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
  disabled?: boolean;
}

const MentionButtons = ({ onInsertPlaceholder, disabled = false }: MentionButtonsProps) => {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onInsertPlaceholder('customer')}
            title="Mention customer"
            disabled={disabled}
          >
            <User className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mention Customer</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onInsertPlaceholder('company')}
            title="Mention company"
            disabled={disabled}
          >
            <Building2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mention Company</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onInsertPlaceholder('ticket')}
            title="Reference ticket"
            disabled={disabled}
          >
            <TicketIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reference Ticket</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default MentionButtons;
