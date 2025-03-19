
import React, { useState, useEffect } from 'react';
import { Check, User, Users, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import type { AssigneeOption, AssigneeType } from "./types";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectAllTeammates, selectTeammatesLoading } from '@/store/slices/teammates/selectors';
import { selectAllTeams, selectTeamsLoading } from '@/store/slices/teams/selectors';
import { fetchTeammates } from '@/store/slices/teammates/actions';

// Current user for self-assign option
const CURRENT_USER: AssigneeOption = { id: 'self', name: 'Myself', type: 'self' as AssigneeType };

interface AssigneeSelectProps {
  value: AssigneeOption | null;
  onChange: (value: AssigneeOption | null) => void;
}

const AssigneeSelect = ({ value, onChange }: AssigneeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  
  // Fetch teammates and teams from Redux store
  const teammates = useAppSelector(selectAllTeammates);
  const teams = useAppSelector(selectAllTeams);
  const teamsLoading = useAppSelector(selectTeamsLoading);
  const teammatesLoading = useAppSelector(selectTeammatesLoading);
  
  const isLoading = teamsLoading || teammatesLoading;

  // Fetch teammates on component mount
  useEffect(() => {
    dispatch(fetchTeammates());
    // Note: We're not dispatching a team fetch action because it should be handled
    // elsewhere in the application, for example in a parent component or app initialization
  }, [dispatch]);

  // Map teammates to AssigneeOption format
  const teammateOptions: AssigneeOption[] = teammates.map(teammate => ({
    id: teammate.id,
    name: teammate.name,
    type: 'teammate' as AssigneeType
  }));

  // Map teams to AssigneeOption format
  const teamOptions: AssigneeOption[] = teams.map(team => ({
    id: team.id,
    name: team.name,
    type: 'team' as AssigneeType
  }));

  const handleSelect = (option: AssigneeOption) => {
    onChange(option);
    setOpen(false);
  };

  // Filter options based on search query
  const filteredTeamOptions = teamOptions.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTeammateOptions = teammateOptions.filter(teammate => 
    teammate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="assignee">Assign to</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={() => setOpen(true)}
          >
            {value ? value.name : "Select assignee..."}
            <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search assignee..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No assignee found.</CommandEmpty>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <CommandGroup heading="Assign to">
                    <CommandItem 
                      onSelect={() => handleSelect(CURRENT_USER)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {CURRENT_USER.name}
                      {value?.id === CURRENT_USER.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  </CommandGroup>
                  
                  {filteredTeamOptions.length > 0 && (
                    <CommandGroup heading="Teams">
                      {filteredTeamOptions.map((team) => (
                        <CommandItem
                          key={team.id}
                          onSelect={() => handleSelect(team)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {team.name}
                          {value?.id === team.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  {filteredTeammateOptions.length > 0 && (
                    <CommandGroup heading="Teammates">
                      {filteredTeammateOptions.map((teammate) => (
                        <CommandItem
                          key={teammate.id}
                          onSelect={() => handleSelect(teammate)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {teammate.name}
                          {value?.id === teammate.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AssigneeSelect;
