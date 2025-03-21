
import React from 'react';
import * as icons from 'lucide-react';
import { Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TeamIconPickerProps } from '@/types/team';
import type { LucideIcon } from 'lucide-react';

// Filter out non-icon entries and create properly typed icon array
const availableIcons = Object.entries(icons)
  .filter(([name]) => name !== 'createLucideIcon' && name !== 'icons')
  .map(([name, icon]) => ({
    name,
    icon: icon as LucideIcon,
  }));

const TeamIconPicker = ({ selectedIcon, onIconSelect }: TeamIconPickerProps) => {
  const [openIconPicker, setOpenIconPicker] = React.useState(false);

  // Find the selected icon component
  const SelectedIcon = selectedIcon ? (icons[selectedIcon as keyof typeof icons] as LucideIcon) : Smile;

  return (
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
            <SelectedIcon className="mr-2 h-4 w-4" />
            {selectedIcon || 'Select an icon'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search icons..." />
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {availableIcons.map(({ name, icon: Icon }) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        onIconSelect(name);
                        setOpenIconPicker(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className={cn(
                        "h-4 w-4",
                        selectedIcon === name ? "text-primary" : "text-gray-500"
                      )} />
                      <span className="text-sm">{name}</span>
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TeamIconPicker;

