
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { useEffect } from 'react';
import suggestion from '../../utils/suggestion';
import type { Ticket } from '@/types/ticket';

interface TicketMessageEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TicketMessageEditor = ({ content, onChange }: TicketMessageEditorProps) => {
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your initial message...',
      }),
      Mention.configure({
        suggestion: suggestion(dummyTicket),
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  return (
    <EditorContent editor={editor} />
  );
};

export default TicketMessageEditor;
