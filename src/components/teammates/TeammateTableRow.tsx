
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import type { Teammate } from '@/types/teammate';

interface TeammateTableRowProps {
  teammate: Teammate;
  isSelected: boolean;
  onSelect: (teammateId: string, checked: boolean) => void;
  onResendInvitation: (teammateId: string) => void;
}

const TeammateTableRow = ({
  teammate,
  isSelected,
  onSelect,
  onResendInvitation
}: TeammateTableRowProps) => {
  return (
    <TableRow>
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
        <Badge variant={teammate.role === 'admin' ? 'default' : 'secondary'}>
          {teammate.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={teammate.status === 'active' ? 'default' : 'secondary'}>
          {teammate.status}
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(teammate.lastActive), 'MMM d, yyyy HH:mm')}
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
