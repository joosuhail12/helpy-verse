
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Strikethrough, User, Building2, Ticket as TicketIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
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
    <div className="border-b p-2 flex items-center gap-1">
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
      <Separator orientation="vertical" className="mx-1 h-6" />
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
      <Separator orientation="vertical" className="mx-1 h-6" />
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
    </div>
  );
};

export default MessageToolbar;
