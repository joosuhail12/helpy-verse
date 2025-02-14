
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Editor } from '@tiptap/react';
import FormatButtons from './toolbar/FormatButtons';
import MentionButtons from './toolbar/MentionButtons';

interface CannedResponseEditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

const CannedResponseEditorToolbar = ({ 
  editor, 
  disabled = false,
}: CannedResponseEditorToolbarProps) => {
  const handleInsertPlaceholder = (type: 'customer' | 'company' | 'ticket') => {
    if (!editor) return;
    
    switch (type) {
      case 'customer':
        editor.commands.insertContent('@customer.name');
        break;
      case 'company':
        editor.commands.insertContent('@company.name');
        break;
      case 'ticket':
        editor.commands.insertContent('@ticket.number');
        break;
    }
  };

  return (
    <TooltipProvider>
      <div className="border-b p-2 flex items-center gap-1">
        <FormatButtons editor={editor} disabled={disabled} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <MentionButtons onInsertPlaceholder={handleInsertPlaceholder} disabled={disabled} />
      </div>
    </TooltipProvider>
  );
};

export default CannedResponseEditorToolbar;

