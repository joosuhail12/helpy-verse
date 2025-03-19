
import React, { useState } from 'react';
import { 
  Headphones, DollarSign, Briefcase, Users, Tool, LifeBuoy, Zap, 
  MessageCircle, Phone, Mail, Shield, Heart, Award, Star 
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TeamIconPickerProps } from '@/types/team';

const iconMap: Record<string, React.ReactNode> = {
  'headphones': <Headphones />,
  'dollar-sign': <DollarSign />,
  'briefcase': <Briefcase />,
  'users': <Users />,
  'tool': <Tool />,
  'lifeBuoy': <LifeBuoy />,
  'zap': <Zap />,
  'message-circle': <MessageCircle />,
  'phone': <Phone />,
  'mail': <Mail />,
  'shield': <Shield />,
  'heart': <Heart />,
  'award': <Award />,
  'star': <Star />
};

export const TeamIconPicker: React.FC<TeamIconPickerProps> = ({ 
  selectedIcon, 
  setSelectedIcon,
  onIconSelect 
}) => {
  const [open, setOpen] = useState(false);

  const handleSelectIcon = (icon: string) => {
    setSelectedIcon(icon);
    if (onIconSelect) {
      onIconSelect(icon);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 w-10 rounded-md p-0"
          aria-label="Select icon"
        >
          {iconMap[selectedIcon] || <Users />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(iconMap).map(([name, icon]) => (
            <Button
              key={name}
              variant="ghost"
              className={`h-10 w-10 p-0 ${selectedIcon === name ? 'bg-primary/10' : ''}`}
              onClick={() => handleSelectIcon(name)}
            >
              <span className="sr-only">Select {name} icon</span>
              {icon}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
