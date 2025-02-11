
import React from 'react';
import { Button } from '@/components/ui/button';
import { StickyNote } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InternalNoteButtonProps {
  isInternalNote: boolean;
  setIsInternalNote: (value: boolean) => void;
  disabled?: boolean;
}

const InternalNoteButton = ({ isInternalNote, setIsInternalNote, disabled = false }: InternalNoteButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isInternalNote ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsInternalNote(!isInternalNote)}
          disabled={disabled}
        >
          <StickyNote className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Internal Note</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default InternalNoteButton;
