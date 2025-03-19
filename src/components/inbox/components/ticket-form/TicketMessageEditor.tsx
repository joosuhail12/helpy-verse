
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { useEffect } from 'react';
import { createEditorConfig } from '../../utils/editorConfig';
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

  const editor = useEditor(
    createEditorConfig(content, (editor) => {
      onChange(editor.getHTML());
    }, dummyTicket)
  );

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b px-3 py-2 flex items-center space-x-1">
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <span className="italic">I</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          • List
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] p-3"
      />
    </div>
  );
};

export default TicketMessageEditor;
