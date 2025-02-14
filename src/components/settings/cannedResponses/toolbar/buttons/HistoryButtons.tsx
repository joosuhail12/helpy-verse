
import React from 'react';
import { Undo, Redo } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import FormatButton from './FormatButton';

interface HistoryButtonsProps {
  editor: Editor | null;
  disabled?: boolean;
}

const HistoryButtons = ({ editor, disabled = false }: HistoryButtonsProps) => {
  return (
    <>
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().undo().run();
        }}
        icon={Undo}
        tooltipText="Undo"
        disabled={disabled}
      />
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().redo().run();
        }}
        icon={Redo}
        tooltipText="Redo"
        disabled={disabled}
      />
    </>
  );
};

export default HistoryButtons;

