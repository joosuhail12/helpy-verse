
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Teammate } from '@/types/teammate';

interface TeammateAvatarProps {
  teammate: Teammate;
  isEditing: boolean;
  editedName: string;
  onEditedNameChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEditing: () => void;
}

const TeammateAvatar = ({
  teammate,
  isEditing,
  editedName,
  onEditedNameChange,
  onSaveEdit,
  onCancelEdit,
  onStartEditing,
}: TeammateAvatarProps) => {
  return (
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
              onChange={(e) => onEditedNameChange(e.target.value)}
              className="h-8 w-48"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveEdit}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to={`/home/settings/teammates/${teammate.id}`}
              className="font-medium hover:underline"
            >
              {teammate.name}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartEditing}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeammateAvatar;
