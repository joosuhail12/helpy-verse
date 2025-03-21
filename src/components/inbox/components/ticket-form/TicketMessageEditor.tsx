
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Ticket } from '@/types/ticket';
import { createEditorConfig } from '../../utils/editorConfig';
import MessageToolbar from '../MessageToolbar';
import { cn } from "@/lib/utils";

interface TicketMessageEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TicketMessageEditor = ({ content, onChange }: TicketMessageEditorProps) => {
  // Create a dummy ticket for the editor configuration
  const dummyTicket: Ticket = {
    id: 'new-ticket',
    subject: '',
    customer: '',
    lastMessage: '',
    assignee: null,
    tags: [],
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    isUnread: false,
    recipients: [],
    company: '',
  };

  const editor = useEditor(
    createEditorConfig(content, (editor) => {
      onChange(editor.getHTML());
    }, dummyTicket)
  );

  const handleEmojiSelect = (emojiData: any) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  const insertPlaceholder = (type: 'customer' | 'company' | 'ticket') => {
    let content = '';
    switch (type) {
      case 'customer':
        content = `@Customer`;
        break;
      case 'company':
        content = `@Company`;
        break;
      case 'ticket':
        content = `#new-ticket`;
        break;
    }
    editor?.commands.insertContent(content);
  };

  return (
    <div className="rounded-md overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/80">
        <MessageToolbar 
          editor={editor}
          onInsertPlaceholder={insertPlaceholder}
          ticket={dummyTicket}
          disabled={false}
          isInternalNote={false}
          setIsInternalNote={() => {}}
          onEmojiSelect={handleEmojiSelect}
          onFilesAdded={() => {}}
          uploadProgress={{}}
          onRemoveFile={() => {}}
          files={[]}
          isAttachmentSheetOpen={false}
          setIsAttachmentSheetOpen={() => {}}
        />
      </div>
      <div 
        className={cn(
          "cursor-text min-h-[180px] max-h-[240px] overflow-y-auto",
          "transition-colors focus-within:bg-white/80"
        )}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent 
          editor={editor} 
          className="p-3 overflow-y-auto prose prose-sm max-w-none focus:outline-none h-full"
        />
      </div>
    </div>
  );
};

export default TicketMessageEditor;
