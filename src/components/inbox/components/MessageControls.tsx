
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, StickyNote, Paperclip } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EmojiPickerButton from './EmojiPickerButton';
import FileUpload from './FileUpload';

interface MessageControlsProps {
  isInternalNote: boolean;
  setIsInternalNote: (value: boolean) => void;
  onSendMessage: () => void;
  isSending: boolean;
  disabled: boolean;
  onEmojiSelect: (emojiData: any) => void;
  onFilesAdded: (files: File[]) => void;
  uploadProgress: Record<string, number>;
  onRemoveFile: (file: File) => void;
  files: File[];
  isAttachmentSheetOpen: boolean;
  setIsAttachmentSheetOpen: (value: boolean) => void;
}

const MessageControls = ({
  isInternalNote,
  setIsInternalNote,
  onSendMessage,
  isSending,
  disabled,
  onEmojiSelect,
  onFilesAdded,
  uploadProgress,
  onRemoveFile,
  files,
  isAttachmentSheetOpen,
  setIsAttachmentSheetOpen,
}: MessageControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Button
          variant={isInternalNote ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setIsInternalNote(!isInternalNote)}
          disabled={disabled}
        >
          <StickyNote className="h-4 w-4" />
          Internal Note
        </Button>
        <Sheet open={isAttachmentSheetOpen} onOpenChange={setIsAttachmentSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
              Add Files
            </Button>
          </SheetTrigger>
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
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </div>
        <Button 
          className="gap-2" 
          onClick={onSendMessage}
          disabled={disabled || isSending}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
        </Button>
      </div>
    </div>
  );
};

export default MessageControls;
