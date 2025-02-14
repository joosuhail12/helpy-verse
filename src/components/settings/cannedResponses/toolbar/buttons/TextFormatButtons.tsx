
import React from 'react';
import { Bold, Italic, Code } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import FormatButton from './FormatButton';

interface TextFormatButtonsProps {
  editor: Editor | null;
  disabled?: boolean;
}

const TextFormatButtons = ({ editor, disabled = false }: TextFormatButtonsProps) => {
  return (
    <>
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBold().run();
        }}
        icon={Bold}
        tooltipText="Bold (Ctrl+B)"
        isActive={editor?.isActive('bold')}
        disabled={disabled}
      />
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleItalic().run();
        }}
        icon={Italic}
        tooltipText="Italic (Ctrl+I)"
        isActive={editor?.isActive('italic')}
        disabled={disabled}
      />
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleCode().run();
        }}
        icon={Code}
        tooltipText="Code"
        isActive={editor?.isActive('code')}
        disabled={disabled}
      />
    </>
  );
};

export default TextFormatButtons;

