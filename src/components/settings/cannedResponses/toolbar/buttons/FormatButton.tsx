
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { LucideIcon } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface FormatButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: LucideIcon;
  tooltipText: string;
  isActive?: boolean;
  disabled?: boolean;
}

const FormatButton = ({
  onClick,
  icon: Icon,
  tooltipText,
  isActive,
  disabled = false,
}: FormatButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            data-active={isActive}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormatButton;
