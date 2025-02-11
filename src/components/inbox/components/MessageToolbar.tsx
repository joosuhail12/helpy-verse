
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Strikethrough, User, Building2, Ticket as TicketIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import type { Editor } from '@tiptap/react';
import type { Ticket } from '@/types/ticket';

interface MessageToolbarProps {
  editor: Editor | null;
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
  ticket: Ticket;
  disabled?: boolean;
}

const MessageToolbar = ({ editor, onInsertPlaceholder, ticket, disabled = false }: MessageToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="border-b p-2 flex items-center gap-1">
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

        <Separator orientation="vertical" className="mx-1 h-6" />

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

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onInsertPlaceholder('customer')}
              title="Mention customer"
              disabled={disabled}
            >
              <User className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mention Customer</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onInsertPlaceholder('company')}
              title="Mention company"
              disabled={disabled}
            >
              <Building2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mention Company</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onInsertPlaceholder('ticket')}
              title="Reference ticket"
              disabled={disabled}
            >
              <TicketIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reference Ticket</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default MessageToolbar;

