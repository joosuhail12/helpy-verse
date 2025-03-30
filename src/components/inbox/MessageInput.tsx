import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import useCustomer from '@/hooks/use-customer';
import type { Ticket } from '@/types/ticket';
import MessageToolbar from './components/MessageToolbar';
import AttachmentList from './components/AttachmentList';
import { createEditorConfig } from './utils/editorConfig';
import { cn } from "@/lib/utils";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  ticket: Ticket;
  isSending?: boolean;
  disabled?: boolean;
}

const MessageInput = ({
  newMessage,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  ticket,
  isSending = false,
  disabled = false
}: MessageInputProps) => {
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);

  // Get customer name for better editor placeholders
  const { customerName } = useCustomer(ticket.customerId);

  // Create the editor with proper configuration
  const editor = useEditor({
    extensions: createEditorConfig(newMessage, (editor) => {
      if (editor && typeof editor.getHTML === 'function') {
        onMessageChange(editor.getHTML());
      }
    }, ticket, customerName).extensions,
    content: newMessage,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none w-full max-w-full',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      if (editor && typeof editor.getHTML === 'function') {
        onMessageChange(editor.getHTML());
      }
    }
  });

  // Update editor content when newMessage changes from outside
  useEffect(() => {
    if (editor && editor.commands && typeof editor.commands.setContent === 'function' && newMessage !== editor.getHTML()) {
      editor.commands.setContent(newMessage);
    }
  }, [newMessage, editor]);

  const handleEmojiSelect = (emojiData: any) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    });
  };

  const handleRemoveFile = (file: File) => {
    setFiles(prev => prev.filter(f => f !== file));
    setUploadProgress(prev => {
      const { [file.name]: _, ...rest } = prev;
      return rest;
    });
  };

  const insertPlaceholder = (type: 'customer' | 'company' | 'ticket') => {
    let content = '';
    switch (type) {
      case 'customer':
        content = `@${customerName || ticket.customer || 'Customer'}`;
        break;
      case 'company':
        content = `@${ticket.company}`;
        break;
      case 'ticket':
        content = `#${ticket.id}`;
        break;
    }
    editor?.commands.insertContent(content);
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className={cn(
        "border rounded-lg mb-3",
        isInternalNote && "border-yellow-400 bg-yellow-50"
      )}>
        <MessageToolbar
          editor={editor}
          onInsertPlaceholder={insertPlaceholder}
          ticket={ticket}
          disabled={disabled}
          isInternalNote={isInternalNote}
          setIsInternalNote={setIsInternalNote}
          onEmojiSelect={handleEmojiSelect}
          onFilesAdded={handleFilesAdded}
          uploadProgress={uploadProgress}
          onRemoveFile={handleRemoveFile}
          files={files}
          isAttachmentSheetOpen={isAttachmentSheetOpen}
          setIsAttachmentSheetOpen={setIsAttachmentSheetOpen}
        />
        <div
          className={`cursor-text ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent
            editor={editor}
            className="p-3"
            onKeyDown={onKeyPress}
          />
        </div>
        <AttachmentList
          files={files}
          onRemoveFile={handleRemoveFile}
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-end gap-4">
        <div className="text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </div>
        <button
          className={cn(
            "px-4 py-2 rounded-md bg-primary text-white flex items-center gap-2",
            disabled && "opacity-50 cursor-not-allowed",
            isInternalNote && "bg-yellow-500"
          )}
          onClick={onSendMessage}
          disabled={disabled || isSending}
        >
          {isSending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
