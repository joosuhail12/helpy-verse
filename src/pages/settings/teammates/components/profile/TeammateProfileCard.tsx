
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar } from 'lucide-react';
import type { Teammate } from '@/types/teammate';
import { TeammateAvatar } from './TeammateAvatar';
import { TeammateNameField } from './TeammateNameField';
import { TeammateEmailField } from './TeammateEmailField';
import { TeammateRoleField } from './TeammateRoleField';
import { TeammateStatusField } from './TeammateStatusField';
import { TeammateTimestampField } from './TeammateTimestampField';

interface TeammateProfileCardProps {
  teammate: Teammate;
  isEditing: boolean;
  onUpdateTeammate: (updates: Partial<Teammate>) => void;
  validationErrors: Record<string, string>;
  isLoading: boolean;
}

const TeammateProfileCard = ({
  teammate,
  isEditing,
  onUpdateTeammate,
  validationErrors,
  isLoading,
}: TeammateProfileCardProps) => {
  const handleUpdateAvatar = (avatarUrl: string) => {
    onUpdateTeammate({ avatar: avatarUrl });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <TeammateAvatar 
          teammate={teammate} 
          isEditing={isEditing} 
          isLoading={isLoading} 
          onUpdateAvatar={handleUpdateAvatar} 
        />
        <div className="flex-grow">
          <TeammateNameField 
            teammate={teammate}
            isEditing={isEditing}
            isLoading={isLoading}
            validationError={validationErrors.name}
            onUpdateName={(name) => onUpdateTeammate({ name })}
          />
          <CardDescription className="flex items-center gap-2">
            <TeammateEmailField 
              teammate={teammate}
              isEditing={isEditing}
              isLoading={isLoading}
              validationError={validationErrors.email}
              onUpdateEmail={(email) => onUpdateTeammate({ email })}
            />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <TeammateRoleField 
            teammate={teammate}
            isEditing={isEditing}
            isLoading={isLoading}
            onUpdateRole={(role) => onUpdateTeammate({ role })}
          />
          <Separator />
          <TeammateStatusField 
            teammate={teammate}
            isEditing={isEditing}
            isLoading={isLoading}
            onUpdateStatus={(status) => onUpdateTeammate({ status })}
          />
          <Separator />
          <TeammateTimestampField 
            label="Last Active"
            timestamp={teammate.lastActive}
            icon={Clock}
          />
          <Separator />
          <TeammateTimestampField 
            label="Joined"
            timestamp={teammate.createdAt}
            icon={Calendar}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeammateProfileCard;
