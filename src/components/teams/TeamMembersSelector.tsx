import React, { useEffect, useState } from 'react';
import { fetchTeammates } from '@/store/slices/teammates/teammatesSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { TeamMembersSelectorProps } from '@/types/team';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

const TeamMembersSelector = ({
  selectedTeammates,
  onTeammateToggle,
}: TeamMembersSelectorProps) => {
  const dispatch = useAppDispatch();
  const teammates = useAppSelector(state => state.teammates.teammates);

  useEffect(() => {
    dispatch(fetchTeammates());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeammates = teammates.filter(teammate =>
    teammate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teammate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>Team Members</Label>
      <div className="relative mb-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <ScrollArea className="h-[200px] w-full border rounded-md p-4">
        <div className="space-y-2">
          {filteredTeammates.map((teammate) => (
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
          {filteredTeammates.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No team members found
            </div>
          )}
        </div>
      </ScrollArea>
      <Select onValueChange={onTeammateToggle}>
        <SelectTrigger>
          <SelectValue placeholder="Select a teammate" />
        </SelectTrigger>
        <SelectContent>
          {teammates.map(teammate => (
            <SelectItem key={teammate.id} value={teammate.id}>
              {teammate.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamMembersSelector;
