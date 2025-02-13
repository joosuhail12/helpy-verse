
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Edit, Lock, Unlock, Trash, Mail } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Teammate } from '@/types/teammate';
import TeammateAvatar from './TeammateAvatar';
import TeammateEmail from './TeammateEmail';
import TeammateRoleBadge from './TeammateRoleBadge';
import TeammateStatusBadge from './TeammateStatusBadge';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from "@/hooks/use-toast";

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
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleToggleStatus = () => {
    if (onUpdateTeammate) {
      const newStatus = teammate.status === 'active' ? 'inactive' : 'active';
      onUpdateTeammate(teammate.id, { status: newStatus });
      toast({
        description: `${teammate.name}'s account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
      });
    }
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${teammate.email}`;
  };

  const handleDelete = () => {
    toast({
      description: "Delete functionality will be implemented soon.",
    });
  };

  const handleEditProfile = () => {
    navigate(`/home/settings/teammates/${teammate.id}`);
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
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResendInvitation(teammate.id)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resend invitation email</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus}>
                {teammate.status === 'active' ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Deactivate Account
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Activate Account
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSendEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TeammateTableRow;

