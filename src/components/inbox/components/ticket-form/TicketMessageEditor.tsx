
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createEditorConfig } from '../../utils/editorConfig';
import FormatButtons from '../toolbar/FormatButtons';
import { Separator } from "@/components/ui/separator";

interface TicketMessageEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TicketMessageEditor = ({ content, onChange }: TicketMessageEditorProps) => {
  const editor = useEditor(
    createEditorConfig(content, (editor) => {
      onChange(editor.getHTML());
    }, { id: 'new', subject: '', customer: '', lastMessage: '', assignee: null, tags: [], status: 'open', priority: 'medium', createdAt: '' })
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex items-center gap-1 bg-white">
        <FormatButtons editor={editor} />
      </div>
      <div className="bg-white">
        <EditorContent 
          editor={editor} 
          className="p-3 min-h-[150px] prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TicketMessageEditor;
