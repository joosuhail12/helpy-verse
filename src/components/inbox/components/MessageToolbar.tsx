
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip-provider";
import type { Editor } from '@tiptap/react';
import type { Ticket } from '@/types/ticket';
import EmojiPickerButton from './EmojiPickerButton';
import InternalNoteButton from './toolbar/InternalNoteButton';
import FormatButtons from './toolbar/FormatButtons';
import MentionButtons from './toolbar/MentionButtons';
import AttachmentButton from './toolbar/AttachmentButton';

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
        <InternalNoteButton
          isInternalNote={isInternalNote}
          setIsInternalNote={setIsInternalNote}
          disabled={disabled}
        />

        <AttachmentButton
          disabled={disabled}
          isAttachmentSheetOpen={isAttachmentSheetOpen}
          setIsAttachmentSheetOpen={setIsAttachmentSheetOpen}
          onFilesAdded={onFilesAdded}
          uploadProgress={uploadProgress}
          onRemoveFile={onRemoveFile}
          files={files}
        />

        <EmojiPickerButton onEmojiSelect={onEmojiSelect} disabled={disabled} />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <FormatButtons editor={editor} disabled={disabled} />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <MentionButtons onInsertPlaceholder={onInsertPlaceholder} disabled={disabled} />
      </div>
    </TooltipProvider>
  );
};

export default MessageToolbar;
