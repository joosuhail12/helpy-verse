
import { useState } from 'react';
import { Check, ChevronsUpDown, PlusCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Teammate } from '@/types/teammate';

interface TeamMembersSelectorProps {
  teammates: Teammate[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

const TeamMembersSelector = ({ 
  teammates, 
  selectedTeammates, 
  onTeammateToggle 
}: TeamMembersSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTeammateItems = teammates.filter(teammate => 
    selectedTeammates.includes(teammate.id)
  );
  
  const notSelectedTeammateItems = teammates.filter(teammate => 
    !selectedTeammates.includes(teammate.id)
  );

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedTeammates.length > 0
                ? `${selectedTeammates.length} teammates selected`
                : "Select teammates"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command className="max-h-[300px]">
            <CommandInput 
              placeholder="Search teammates..." 
              onValueChange={setSearchQuery} 
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No teammates found.</CommandEmpty>
              <CommandGroup heading="Teammates">
                {notSelectedTeammateItems
                  .filter(teammate => 
                    teammate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    teammate.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(teammate => (
                    <CommandItem
                      key={teammate.id}
                      value={teammate.id}
                      onSelect={() => {
                        onTeammateToggle(teammate.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={teammate.avatar} />
                        <AvatarFallback>{teammate.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate">{teammate.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{teammate.email}</p>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4 opacity-0",
                          selectedTeammates.includes(teammate.id) && "opacity-100"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTeammateItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTeammateItems.map(teammate => (
            <Badge
              key={teammate.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Avatar className="h-4 w-4 mr-1">
                <AvatarImage src={teammate.avatar} />
                <AvatarFallback>{teammate.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {teammate.name}
              <button
                onClick={() => onTeammateToggle(teammate.id)}
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMembersSelector;
