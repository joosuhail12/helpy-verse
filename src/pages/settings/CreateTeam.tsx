
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from 'lucide-react';
import { Smile } from 'lucide-react';
import * as icons from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const availableIcons = Object.entries(icons)
  .filter(([name]) => name !== 'createLucideIcon' && name !== 'icons')
  .map(([name, icon]) => ({
    name,
    icon,
  }));

const CreateTeam = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammates = useAppSelector((state) => state.teammates.teammates);

  const [teamName, setTeamName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [openIconPicker, setOpenIconPicker] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teamName,
          icon: selectedIcon,
          members: selectedTeammates,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      toast({
        title: "Success",
        description: "Team created successfully",
      });
      navigate('/home/settings/teams');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTeammate = (teammateId: string) => {
    setSelectedTeammates(prev =>
      prev.includes(teammateId)
        ? prev.filter(id => id !== teammateId)
        : [...prev, teammateId]
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Team</h1>
        <Button variant="outline" onClick={() => navigate('/home/settings/teams')}>
          Cancel
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Team Icon</Label>
          <Popover open={openIconPicker} onOpenChange={setOpenIconPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openIconPicker}
                className="w-full justify-between"
              >
                {selectedIcon ? (
                  <>
                    {React.createElement(icons[selectedIcon as keyof typeof icons], {
                      className: "mr-2 h-4 w-4",
                    })}
                    {selectedIcon}
                  </>
                ) : (
                  <>
                    <Smile className="mr-2 h-4 w-4" />
                    Select an icon
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search icons..." />
                <CommandEmpty>No icon found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {availableIcons.map(({ name, icon }) => (
                        <CommandItem
                          key={name}
                          value={name}
                          onSelect={() => {
                            setSelectedIcon(name);
                            setOpenIconPicker(false);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {React.createElement(icon, {
                            className: cn(
                              "h-4 w-4",
                              selectedIcon === name ? "text-primary" : "text-gray-500"
                            ),
                          })}
                          <span className="text-sm">{name}</span>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Team Members</Label>
            <ScrollArea className="h-[200px] w-full border rounded-md p-4">
              <div className="space-y-2">
                {teammates.map((teammate) => (
                  <div
                    key={teammate.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    onClick={() => toggleTeammate(teammate.id)}
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

          <Button
            className="w-full mt-6"
            onClick={handleCreateTeam}
            disabled={!teamName.trim()}
          >
            Create Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
