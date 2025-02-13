
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';
import type { Teammate } from '@/types/teammate';
import TeammateAvatar from './TeammateAvatar';
import TeammateEmail from './TeammateEmail';
import TeammateRoleBadge from './TeammateRoleBadge';
import TeammateStatusBadge from './TeammateStatusBadge';

interface TeammateTableRowProps {
  teammate: Teammate;
  isSelected: boolean;
  onSelect: (teammateId: string, checked: boolean) => void;
  onResendInvitation: (teammateId: string) => void;
  onUpdateTeammate?: (teammateId: string, updates: Partial<Teammate>) => void;
}

const TeammateTableRow = ({
  teammate,
  isSelected,
  onSelect,
  onResendInvitation,
  onUpdateTeammate
}: TeammateTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(teammate.name);

  const handleSaveEdit = () => {
    if (onUpdateTeammate && editedName.trim() !== '') {
      onUpdateTeammate(teammate.id, { name: editedName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(teammate.name);
    setIsEditing(false);
  };

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
          <TeammateAvatar
            teammate={teammate}
            isEditing={isEditing}
            editedName={editedName}
            onEditedNameChange={setEditedName}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onStartEditing={() => setIsEditing(true)}
          />
          <TeammateEmail email={teammate.email} />
        </div>
      </TableCell>
      <TableCell>
        <TeammateRoleBadge role={teammate.role} />
      </TableCell>
      <TableCell>
        <TeammateStatusBadge status={teammate.status} />
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
