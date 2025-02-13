
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Teammate } from '@/types/teammate';

interface TeamMembersSelectorProps {
  teammates: Teammate[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

const TeamMembersSelector = ({
  teammates,
  selectedTeammates,
  onTeammateToggle,
}: TeamMembersSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Team Members</Label>
      <ScrollArea className="h-[200px] w-full border rounded-md p-4">
        <div className="space-y-2">
          {teammates.map((teammate) => (
            <div
              key={teammate.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
              onClick={() => onTeammateToggle(teammate.id)}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {teammate.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{teammate.name}</p>
                  <p className="text-sm text-gray-500">{teammate.email}</p>
                </div>
              </div>
              {selectedTeammates.includes(teammate.id) && (
                <Badge>Selected</Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TeamMembersSelector;
