
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Headphones, DollarSign, ShoppingCart, BarChart, Users, MessageSquare, 
  Shield, Zap, FileText, Heart, Coffee, PenTool, User, 
  CreditCard, Package, Globe, Inbox, Book, Camera
} from 'lucide-react';

interface TeamIconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

export const TeamIconPicker = ({ selectedIcon, onIconSelect }: TeamIconPickerProps) => {
  const [open, setOpen] = useState(false);

  const icons = [
    { name: 'headphones', component: <Headphones className="h-4 w-4" /> },
    { name: 'dollar-sign', component: <DollarSign className="h-4 w-4" /> },
    { name: 'shopping-cart', component: <ShoppingCart className="h-4 w-4" /> },
    { name: 'bar-chart', component: <BarChart className="h-4 w-4" /> },
    { name: 'users', component: <Users className="h-4 w-4" /> },
    { name: 'message-square', component: <MessageSquare className="h-4 w-4" /> },
    { name: 'shield', component: <Shield className="h-4 w-4" /> },
    { name: 'zap', component: <Zap className="h-4 w-4" /> },
    { name: 'file-text', component: <FileText className="h-4 w-4" /> },
    { name: 'heart', component: <Heart className="h-4 w-4" /> },
    { name: 'coffee', component: <Coffee className="h-4 w-4" /> },
    { name: 'pen-tool', component: <PenTool className="h-4 w-4" /> },
    { name: 'user', component: <User className="h-4 w-4" /> },
    { name: 'credit-card', component: <CreditCard className="h-4 w-4" /> },
    { name: 'package', component: <Package className="h-4 w-4" /> },
    { name: 'globe', component: <Globe className="h-4 w-4" /> },
    { name: 'inbox', component: <Inbox className="h-4 w-4" /> },
    { name: 'book', component: <Book className="h-4 w-4" /> },
    { name: 'camera', component: <Camera className="h-4 w-4" /> },
  ];

  const getIconComponent = (iconName: string) => {
    const icon = icons.find((i) => i.name === iconName);
    return icon ? icon.component : <Users className="h-4 w-4" />;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
        >
          <div className="flex items-center">
            <div className="mr-2">
              {selectedIcon ? getIconComponent(selectedIcon) : <Users className="h-4 w-4" />}
            </div>
            <span>{selectedIcon ? selectedIcon : 'Select an icon'}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="bottom">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandList>
            <CommandEmpty>No icons found.</CommandEmpty>
            <CommandGroup>
              {icons.map((icon) => (
                <CommandItem
                  key={icon.name}
                  value={icon.name}
                  onSelect={(value) => {
                    onIconSelect(value);
                    setOpen(false);
                  }}
                >
                  <div className="mr-2">{icon.component}</div>
                  <span>{icon.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
