import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import useCustomer from '@/hooks/use-customer';
import { createEditorConfig } from './utils/editorConfig';
import { cn } from "@/lib/utils";
import MessageToolbar from './components/MessageToolbar';
import AttachmentList from './components/AttachmentList';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  ticket: any;
  isSending?: boolean;
  disabled?: boolean;
  handleTyping?: () => void;
  isInternalNote?: boolean;
  setIsInternalNote?: (value: boolean) => void;
}

const MessageInput = ({
  newMessage,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  ticket,
  isSending = false,
  disabled = false,
  handleTyping,
  isInternalNote: isInternalNoteProp = false,
  setIsInternalNote: setIsInternalNoteProp
}: MessageInputProps) => {
  const [isInternalNote, setIsInternalNoteLocal] = useState(isInternalNoteProp);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);

  // Get customer name for better editor placeholders
  const { customer: customerData, isLoading } = useCustomer(ticket?.customerId);
  // Safely access customer name with fallback
  const customerName = customerData?.name || ticket?.customer || 'Customer';

  // Improve the handleContentChange function to ensure HTML is correctly captured
  const handleContentChange = useCallback(({ editor }: { editor: any }) => {
    if (editor && typeof editor.getHTML === 'function') {
      const html = editor.getHTML();
      console.log("Editor content changed:", html);

      // Only update if the content has actually changed
      if (html !== newMessage) {
        onMessageChange(html);

        // Trigger typing indicator whenever content changes
        if (html && html !== '<p></p>' && handleTyping) {
          handleTyping();
        }
      }
    }
  }, [onMessageChange, handleTyping, newMessage]);

  // Create editor config with proper wrapper function
  const editorConfig = createEditorConfig(
    newMessage,
    (editor) => handleContentChange({ editor }),
    ticket,
    customerName
  );

  const editor = useEditor({
    extensions: editorConfig.extensions,
    content: newMessage,
    editorProps: editorConfig.editorProps
  });

  // Initialize editor with message content
  useEffect(() => {
    if (editor && !editor.isDestroyed && newMessage !== editor.getHTML()) {
      editor.commands.setContent(newMessage);
    }
  }, [editor, newMessage]);

  // Use prop setIsInternalNote if provided
  useEffect(() => {
    if (setIsInternalNoteProp) {
      setIsInternalNoteProp(isInternalNote);
    }
  }, [isInternalNote, setIsInternalNoteProp]);

  // Use prop isInternalNote if controlled
  useEffect(() => {
    if (isInternalNoteProp !== undefined) {
      setIsInternalNoteLocal(isInternalNoteProp);
    }
  }, [isInternalNoteProp]);

  // Handle file uploads
  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  // Add emoji to editor
  const handleEmojiSelect = (emojiData: any) => {
    if (editor && editor.commands && typeof editor.commands.insertContent === 'function') {
      const emoji = typeof emojiData === 'string' ? emojiData :
        (emojiData.emoji || emojiData.native || emojiData.colons || '');
      editor.commands.insertContent(emoji);
    }
  };

  // Insert placeholder
  const insertPlaceholder = (content: string) => {
    if (editor && editor.commands && typeof editor.commands.insertContent === 'function') {
      editor.commands.insertContent(content);
    }
  };

  // Also improve the handleSendClick function
  const handleSendClick = () => {
    console.log("Send button clicked in MessageInput");

    // Make sure we have the latest content from the editor
    if (editor && typeof editor.getHTML === 'function') {
      const currentHTML = editor.getHTML();
      console.log("Current editor HTML:", currentHTML);

      // Update the message if it's different
      if (currentHTML !== newMessage) {
        onMessageChange(currentHTML);
      }
    }

    // Debug the current message state
    console.log("Current message state:", newMessage);

    // Check if the message is valid before sending
    const content = newMessage || '';
    const isEmptyHtml = !content ||
      content.trim() === '' ||
      content === '<p></p>' ||
      content === '<p><br></p>' ||
      content === '<p>&nbsp;</p>';

    if (isEmptyHtml) {
      console.log("Message is empty or contains only HTML placeholders, not sending");
      return;
    }

    // Make sure our message has proper HTML structure
    // If it doesn't appear to be HTML, wrap it in paragraph tags
    let messageToSend = content;
    if (messageToSend && !messageToSend.startsWith('<')) {
      messageToSend = `<p>${messageToSend}</p>`;
      // Update the message state with proper HTML
      onMessageChange(messageToSend);
    }

    console.log("Proceeding to send message:", messageToSend);

    // Call the provided onSendMessage function
    onSendMessage();
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
          setIsInternalNote={setIsInternalNoteLocal}
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
          onClick={handleSendClick}
          disabled={disabled || isSending}
        >
          {isSending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
