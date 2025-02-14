
import { Mail, MessageCircle, MessageSquare, Envelope } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const icons = [
  { icon: Mail, label: 'Mail' },
  { icon: MessageCircle, label: 'Message Circle' },
  { icon: MessageSquare, label: 'Message Square' },
];

interface IconSelectionProps {
  selectedIcon: typeof icons[0] | null;
  onSelectIcon: (icon: typeof icons[0]) => void;
}

export function IconSelection({ selectedIcon, onSelectIcon }: IconSelectionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2",
            !selectedIcon && "text-muted-foreground"
          )}
        >
          {selectedIcon ? (
            <>
              {<selectedIcon.icon className="h-4 w-4" />}
              {selectedIcon.label}
            </>
          ) : (
            "Select an icon..."
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {icons.map((icon) => (
          <DropdownMenuItem
            key={icon.label}
            onClick={() => onSelectIcon(icon)}
            className="gap-2"
          >
            <icon.icon className="h-4 w-4" />
            {icon.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { icons };
