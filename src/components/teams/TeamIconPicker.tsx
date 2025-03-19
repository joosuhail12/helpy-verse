
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Building,
  Users,
  Headphones,
  ShoppingCart,
  MessageSquare,
  LifeBuoy,
  Zap,
  Briefcase,
  Globe,
  Star,
  Bell,
  Check,
  ChevronDown,
} from "lucide-react";
import { TeamIconPickerProps } from '@/types/team';

export const TeamIconPicker = ({ selectedIcon, setSelectedIcon, onIconSelect }: TeamIconPickerProps) => {
  const [open, setOpen] = useState(false);

  const icons = [
    { name: 'users', icon: <Users className="h-5 w-5" /> },
    { name: 'building', icon: <Building className="h-5 w-5" /> },
    { name: 'headphones', icon: <Headphones className="h-5 w-5" /> },
    { name: 'cart', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'message', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'support', icon: <LifeBuoy className="h-5 w-5" /> },
    { name: 'zap', icon: <Zap className="h-5 w-5" /> },
    { name: 'briefcase', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'globe', icon: <Globe className="h-5 w-5" /> },
    { name: 'star', icon: <Star className="h-5 w-5" /> },
    { name: 'bell', icon: <Bell className="h-5 w-5" /> },
  ];

  const selectedIconObj = icons.find(i => i.name === selectedIcon) || icons[0];

  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    if (onIconSelect) {
      onIconSelect(iconName);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            {selectedIconObj.icon}
            <span className="ml-2 capitalize">{selectedIcon || 'Select an icon'}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {icons.map((item) => (
                <CommandItem
                  key={item.name}
                  value={item.name}
                  onSelect={() => handleSelectIcon(item.name)}
                  className="flex items-center"
                >
                  {item.icon}
                  <span className="ml-2 capitalize">{item.name}</span>
                  {selectedIcon === item.name && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
