
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Fix the import to use named import
import { TeamIconPicker } from '@/components/teams/TeamIconPicker';
import { Textarea } from '@/components/ui/textarea';

interface TeamBasicInfoProps {
  teamId?: string;
  initialName?: string;
  initialDescription?: string;
  initialIcon?: string;
  readonly?: boolean;
  onNameChange?: (name: string) => void;
  onDescriptionChange?: (description: string) => void;
  onIconChange?: (icon: string) => void;
}

const TeamBasicInfo: React.FC<TeamBasicInfoProps> = ({
  teamId,
  initialName = '',
  initialDescription = '',
  initialIcon = 'users',
  readonly = false,
  onNameChange,
  onDescriptionChange,
  onIconChange
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [icon, setIcon] = useState(initialIcon);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (onNameChange) onNameChange(newName);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    if (onDescriptionChange) onDescriptionChange(newDescription);
  };

  const handleIconSelect = (selectedIcon: string) => {
    setIcon(selectedIcon);
    if (onIconChange) onIconChange(selectedIcon);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <TeamIconPicker 
            selectedIcon={icon} 
            setSelectedIcon={setIcon}
            onIconSelect={handleIconSelect}
          />
          
          <div className="flex-1">
            <Label htmlFor="team-name" className="mb-2 block">Team Name</Label>
            <Input
              id="team-name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter team name"
              readOnly={readonly}
              className={readonly ? 'bg-gray-100' : ''}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="team-description" className="mb-2 block">Description</Label>
          <Textarea
            id="team-description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter team description"
            readOnly={readonly}
            className={readonly ? 'bg-gray-100' : ''}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamBasicInfo;
