
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Teammate } from '@/types/teammate';

interface TeammateTableRowProps {
  teammate: Teammate;
  isSelected: boolean;
  onSelect: (teammateId: string, checked: boolean) => void;
  onResendInvitation: (teammateId: string) => void;
}

const getRoleBadgeVariant = (role: Teammate['role']) => {
  switch (role) {
    case 'admin':
      return 'default';
    case 'supervisor':
      return 'secondary';
    case 'agent':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getRoleDescription = (role: Teammate['role']) => {
  switch (role) {
    case 'admin':
      return 'Full access to all features and settings';
    case 'supervisor':
      return 'Can manage team members and view reports';
    case 'agent':
      return 'Can handle tickets and chat with customers';
    case 'viewer':
      return 'Can only view tickets and reports';
    default:
      return '';
  }
};

const getStatusDescription = (status: Teammate['status']) => {
  return status === 'active' 
    ? 'Currently active and can access the system' 
    : 'Account is deactivated';
};

const TeammateTableRow = ({
  teammate,
  isSelected,
  onSelect,
  onResendInvitation
}: TeammateTableRowProps) => {
  return (
    <TableRow className="animate-fade-in">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(teammate.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={teammate.avatar} />
            <AvatarFallback>{teammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{teammate.name}</div>
            <div className="text-sm text-gray-500">{teammate.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={getRoleBadgeVariant(teammate.role)}>
              {teammate.role}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{getRoleDescription(teammate.role)}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={teammate.status === 'active' ? 'default' : 'secondary'}>
              {teammate.status}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{getStatusDescription(teammate.status)}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <span>{format(new Date(teammate.lastActive), 'MMM d, yyyy HH:mm')}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Last seen at {format(new Date(teammate.lastActive), 'PPpp')}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        {format(new Date(teammate.createdAt), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onResendInvitation(teammate.id)}
          title="Resend invitation email"
        >
          <Send className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TeammateTableRow;
