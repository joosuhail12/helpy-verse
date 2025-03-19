
import React, { useState } from 'react';
import { Check, User, Users } from 'lucide-react';
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

// Mock data for teammates and teams
const MOCK_TEAMMATES = [
  { id: 'tm1', name: 'Sarah Wilson', type: 'teammate' as AssigneeType },
  { id: 'tm2', name: 'Mike Thompson', type: 'teammate' as AssigneeType },
  { id: 'tm3', name: 'Tom Wilson', type: 'teammate' as AssigneeType },
];

const MOCK_TEAMS = [
  { id: 'team1', name: 'Support Team', type: 'team' as AssigneeType },
  { id: 'team2', name: 'Technical Team', type: 'team' as AssigneeType },
];

// Current user for self-assign option
const CURRENT_USER: AssigneeOption = { id: 'self', name: 'Myself', type: 'self' as AssigneeType };

interface AssigneeSelectProps {
  value: AssigneeOption | null;
  onChange: (value: AssigneeOption | null) => void;
}

const AssigneeSelect = ({ value, onChange }: AssigneeSelectProps) => {
  const [open, setOpen] = useState(false);

  const allOptions = [
    CURRENT_USER,
    ...MOCK_TEAMS,
    ...MOCK_TEAMMATES
  ];

  const handleSelect = (option: AssigneeOption) => {
    onChange(option);
    setOpen(false);
  };

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
          >
            {value ? value.name : "Select assignee..."}
            <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search assignee..." />
            <CommandList>
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandGroup heading="Assign to">
                <CommandItem onSelect={() => handleSelect(CURRENT_USER)}>
                  <User className="mr-2 h-4 w-4" />
                  {CURRENT_USER.name}
                  {value?.id === CURRENT_USER.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              </CommandGroup>
              
              <CommandGroup heading="Teams">
                {MOCK_TEAMS.map((team) => (
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
              
              <CommandGroup heading="Teammates">
                {MOCK_TEAMMATES.map((teammate) => (
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AssigneeSelect;
