
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Strikethrough, User, Building2, Ticket as TicketIcon, StickyNote, Paperclip } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import type { Editor } from '@tiptap/react';
import type { Ticket } from '@/types/ticket';
import EmojiPickerButton from './EmojiPickerButton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FileUpload from './FileUpload';

interface MessageToolbarProps {
  editor: Editor | null;
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
  ticket: Ticket;
  disabled?: boolean;
  isInternalNote: boolean;
  setIsInternalNote: (value: boolean) => void;
  onEmojiSelect: (emojiData: any) => void;
  onFilesAdded: (files: File[]) => void;
  uploadProgress: Record<string, number>;
  onRemoveFile: (file: File) => void;
  files: File[];
  isAttachmentSheetOpen: boolean;
  setIsAttachmentSheetOpen: (value: boolean) => void;
}

const MessageToolbar = ({ 
  editor, 
  onInsertPlaceholder, 
  ticket, 
  disabled = false,
  isInternalNote,
  setIsInternalNote,
  onEmojiSelect,
  onFilesAdded,
  uploadProgress,
  onRemoveFile,
  files,
  isAttachmentSheetOpen,
  setIsAttachmentSheetOpen,
}: MessageToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="border-b p-2 flex items-center gap-1">
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

        <Sheet open={isAttachmentSheetOpen} onOpenChange={setIsAttachmentSheetOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  disabled={disabled}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Files</p>
            </TooltipContent>
          </Tooltip>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Add Attachments</SheetTitle>
              <SheetDescription>
                Drag and drop files or click to select files to upload
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FileUpload
                onFilesAdded={onFilesAdded}
                uploadProgress={uploadProgress}
                onRemoveFile={onRemoveFile}
                files={files}
                disabled={disabled}
              />
            </div>
          </SheetContent>
        </Sheet>

        <EmojiPickerButton onEmojiSelect={onEmojiSelect} disabled={disabled} />

        <Separator orientation="vertical" className="mx-1 h-6" />

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
