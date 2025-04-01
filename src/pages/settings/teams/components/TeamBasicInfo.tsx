
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Teammate } from '@/types/teammate';

export interface TeamBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  icon: string;
  setIcon: (icon: string) => void;
  teammates: Teammate[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

const TeamBasicInfo = ({
  name,
  setName,
  icon,
  setIcon,
  teammates,
  selectedTeammates,
  onTeammateToggle
}: TeamBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="team-name">Team Name</Label>
          <Input
            id="team-name"
            placeholder="Support Team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {['👥', '🛠️', '🔧', '💬', '📞', '📧', '🚀', '🔍', '💼', '⚙️'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`h-10 w-10 flex items-center justify-center text-lg rounded-md 
                  ${icon === emoji ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Team Members</Label>
          <div className="border rounded-md divide-y">
            {teammates.map((teammate) => (
              <div
                key={teammate.id}
                className="flex items-center p-3 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  id={`teammate-${teammate.id}`}
                  checked={selectedTeammates.includes(teammate.id || '')}
                  onChange={() => onTeammateToggle(teammate.id || '')}
                  className="mr-3"
                />
                <label
                  htmlFor={`teammate-${teammate.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {teammate.name}
                  <span className="block text-sm text-gray-500">{teammate.email}</span>
                </label>
              </div>
            ))}
            {teammates.length === 0 && (
              <div className="p-4 text-center text-gray-500">No teammates available</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamBasicInfo;
