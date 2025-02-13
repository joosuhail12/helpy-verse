
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Undo, 
  Redo,
  User,
  Building2,
  Ticket as TicketIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import type { Editor } from '@tiptap/react';

interface CannedResponseEditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
}

const CannedResponseEditorToolbar = ({ 
  editor, 
  disabled = false,
  onInsertPlaceholder,
}: CannedResponseEditorToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="border-b p-2 flex items-center gap-1">
        <FormatButtons editor={editor} disabled={disabled} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <MentionButtons onInsertPlaceholder={onInsertPlaceholder} disabled={disabled} />
      </div>
    </TooltipProvider>
  );
};

const FormatButtons = ({ editor, disabled }: { editor: Editor | null; disabled: boolean }) => (
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

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          data-active={editor?.isActive('blockquote')}
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Quote</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          data-active={editor?.isActive('code')}
          disabled={disabled}
        >
          <Code className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Code</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={disabled}
        >
          <Undo className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Undo</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={disabled}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Redo</p>
      </TooltipContent>
    </Tooltip>
  </>
);

const MentionButtons = ({ onInsertPlaceholder, disabled }: { onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void; disabled: boolean }) => (
  <>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onInsertPlaceholder('customer')}
          disabled={disabled}
        >
          <User className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Insert Customer Placeholder</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onInsertPlaceholder('company')}
          disabled={disabled}
        >
          <Building2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Insert Company Placeholder</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onInsertPlaceholder('ticket')}
          disabled={disabled}
        >
          <TicketIcon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Insert Ticket Reference</p>
      </TooltipContent>
    </Tooltip>
  </>
);

export default CannedResponseEditorToolbar;

