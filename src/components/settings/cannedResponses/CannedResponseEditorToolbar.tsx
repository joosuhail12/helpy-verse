
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Editor } from '@tiptap/react';
import FormatButtons from './toolbar/FormatButtons';
import MentionButtons from './toolbar/MentionButtons';

interface CannedResponseEditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
  onInsertPlaceholder: (type: 'customer' | 'company' | 'ticket') => void;
}

const CannedResponseEditorToolbar = ({ 
  editor, 
  disabled = false,
  onInsertPlaceholder,
}: CannedResponseEditorToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="border-b p-2 flex items-center gap-1">
        <FormatButtons editor={editor} disabled={disabled} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <MentionButtons onInsertPlaceholder={onInsertPlaceholder} disabled={disabled} />
      </div>
    </TooltipProvider>
  );
};

export default CannedResponseEditorToolbar;
