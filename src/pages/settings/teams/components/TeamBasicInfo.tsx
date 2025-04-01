
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Teammate } from '@/types/teammate';

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface TeamBasicInfoProps {
  name: string;
  description: string;
  members: TeamMember[];
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onAddMembers: () => void;
}

const TeamBasicInfo: React.FC<TeamBasicInfoProps> = ({
  name,
  description,
  members,
  onNameChange,
  onDescriptionChange,
  onAddMembers,
}) => {
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Basic Information</CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team-name">Team Name</Label>
          <Input
            id="team-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter team name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team-description">Description</Label>
          <Textarea
            id="team-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter team description"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Team Members ({members.length})</Label>
            <Button variant="outline" size="sm" onClick={onAddMembers}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Members
            </Button>
          </div>
          
          {members.length > 0 ? (
            <div className="space-y-2 mt-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded bg-muted/20">
              <p className="text-muted-foreground">No team members yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamBasicInfo;
