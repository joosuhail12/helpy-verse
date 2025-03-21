import React, { useMemo } from 'react';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Ticket } from '@/types/ticket';
import type { UserPresence } from './types';
import { formatDistanceToNow } from 'date-fns';
import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState } from '@/store/store';
import { Badge } from '@/components/ui/badge';

interface ConversationHeaderProps {
  ticket: Ticket;
  onClose: () => void;
  activeUsers: UserPresence[];
}

const ConversationHeader = ({ ticket, onClose, activeUsers }: ConversationHeaderProps) => {
  // Get customer details from Redux store
  const { contactDetails, loading } = useAppSelector(
    (state: RootState) => state.contacts || {
      contactDetails: null,
      loading: false
    }
  );

  // Memoize customer display information
  const customerInfo = useMemo(() => {
    if (contactDetails) {
      return {
        name: `${contactDetails.firstname} ${contactDetails.lastname}`,
        initials: `${contactDetails.firstname[0]}${contactDetails.lastname[0]}`,
        company: contactDetails.company,
        email: contactDetails.email,
        id: contactDetails.id
      };
    }

    // Fallback to ticket data if no contact details available
    return {
      name: ticket.customer,
      initials: ticket.customer[0],
      company: ticket.company,
      id: ticket.customer
    };
  }, [contactDetails, ticket]);

  // Prioritize contact info if available, otherwise fall back to ticket info
  const displayName = customerInfo.name;
  const displayInitials = customerInfo.initials;
  const displayCompany = customerInfo.company;

  return (
    <div className="border-b p-4 flex items-center justify-between bg-white">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg truncate">{ticket.subject}</h2>
          <Badge variant="outline" className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            #{ticket.id}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {loading ? (
            <div className="h-5 w-5 rounded-full bg-muted animate-pulse"></div>
          ) : (
            <Avatar className="h-5 w-5">
              <span className="text-xs">{displayInitials}</span>
            </Avatar>
          )}
          <p className="text-sm text-muted-foreground">
            {loading ? (
              <span className="inline-block h-4 w-32 bg-muted animate-pulse rounded"></span>
            ) : (
              <>
                {displayName} • {displayCompany}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {activeUsers.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Users className="h-4 w-4" />
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user) => (
                    <Avatar key={user.userId} className="h-6 w-6 border-2 border-white">
                      <span className="text-xs">{user.name[0]}</span>
                    </Avatar>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-white">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div key={user.userId} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.location ? (
                        <>
                          viewing ticket #{user.location.ticketId}
                          {user.location.area && ` (${user.location.area})`}
                        </>
                      ) : 'browsing'}
                      • active {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
          aria-label="Close conversation"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;