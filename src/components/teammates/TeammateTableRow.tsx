
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Send, Copy, Check, X, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';
import type { Teammate } from '@/types/teammate';

interface TeammateTableRowProps {
  teammate: Teammate;
  isSelected: boolean;
  onSelect: (teammateId: string, checked: boolean) => void;
  onResendInvitation: (teammateId: string) => void;
  onUpdateTeammate?: (teammateId: string, updates: Partial<Teammate>) => void;
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
  onResendInvitation,
  onUpdateTeammate
}: TeammateTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(teammate.name);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(teammate.email);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

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
          <Avatar>
            <AvatarImage src={teammate.avatar} />
            <AvatarFallback>{teammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-8 w-48"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">{teammate.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{teammate.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyEmail}
                className="h-6 w-6 p-0"
                title="Copy email"
              >
                {showCopied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
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

