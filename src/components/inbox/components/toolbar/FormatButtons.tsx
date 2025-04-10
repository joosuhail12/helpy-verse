
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Editor } from '@tiptap/react';

interface FormatButtonsProps {
  editor: Editor | null;
  disabled?: boolean;
}

const FormatButtons = ({ editor, disabled = false }: FormatButtonsProps) => {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            data-active={editor?.isActive('bold')}
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold (Ctrl+B)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            data-active={editor?.isActive('italic')}
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Italic (Ctrl+I)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            data-active={editor?.isActive('strike')}
            disabled={disabled}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Strikethrough (Ctrl+Shift+X)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            data-active={editor?.isActive('bulletList')}
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bullet List</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            data-active={editor?.isActive('orderedList')}
            disabled={disabled}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Numbered List</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default FormatButtons;
