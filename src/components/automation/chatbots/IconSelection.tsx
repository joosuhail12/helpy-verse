
import { Bot, Smile, User, UserRound, PersonStanding } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const icons = [
  { id: 'bot', icon: Bot, label: 'Bot' },
  { id: 'smile', icon: Smile, label: 'Smile' },
  { id: 'user', icon: User, label: 'User' },
  { id: 'user-round', icon: UserRound, label: 'User Round' },
  { id: 'person-standing', icon: PersonStanding, label: 'Person' },
];

interface IconSelectionProps {
  selectedIcon: string;
  onSelectIcon: (iconId: string) => void;
}

export function IconSelection({ selectedIcon, onSelectIcon }: IconSelectionProps) {
  const selectedIconData = icons.find(i => i.id === selectedIcon);
  const SelectedIcon = selectedIconData?.icon || Bot;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            <span>{selectedIconData?.label || 'Select an icon'}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {icons.map((icon) => (
          <DropdownMenuItem
            key={icon.id}
            onClick={() => onSelectIcon(icon.id)}
            className="flex items-center gap-2"
          >
            <icon.icon className="h-4 w-4" />
            {icon.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

