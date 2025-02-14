
import React from 'react';
import { List, ListOrdered, Quote } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import FormatButton from './FormatButton';

interface ListFormatButtonsProps {
  editor: Editor | null;
  disabled?: boolean;
}

const ListFormatButtons = ({ editor, disabled = false }: ListFormatButtonsProps) => {
  return (
    <>
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBulletList().run();
        }}
        icon={List}
        tooltipText="Bullet List"
        isActive={editor?.isActive('bulletList')}
        disabled={disabled}
      />
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleOrderedList().run();
        }}
        icon={ListOrdered}
        tooltipText="Numbered List"
        isActive={editor?.isActive('orderedList')}
        disabled={disabled}
      />
      <FormatButton
        onClick={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBlockquote().run();
        }}
        icon={Quote}
        tooltipText="Quote"
        isActive={editor?.isActive('blockquote')}
        disabled={disabled}
      />
    </>
  );
};

export default ListFormatButtons;

