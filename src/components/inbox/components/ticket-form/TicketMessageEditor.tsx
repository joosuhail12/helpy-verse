
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
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex items-center gap-1">
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          • List
        </button>
        <div className="p-1 text-gray-500 text-sm">
          Use @ to mention customer, company, or ticket details
        </div>
      </div>
      <div 
        className="cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent 
          editor={editor} 
          className="p-3 min-h-[150px] overflow-y-auto prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TicketMessageEditor;
