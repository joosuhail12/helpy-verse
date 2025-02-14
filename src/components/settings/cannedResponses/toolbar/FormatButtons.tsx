
import React from 'react';
import type { Editor } from '@tiptap/react';
import TextFormatButtons from './buttons/TextFormatButtons';
import ListFormatButtons from './buttons/ListFormatButtons';
import HistoryButtons from './buttons/HistoryButtons';

interface FormatButtonsProps {
  editor: Editor | null;
  disabled?: boolean;
}

const FormatButtons = ({ editor, disabled = false }: FormatButtonsProps) => {
  return (
    <>
      <TextFormatButtons editor={editor} disabled={disabled} />
      <ListFormatButtons editor={editor} disabled={disabled} />
      <HistoryButtons editor={editor} disabled={disabled} />
    </>
  );
};

export default FormatButtons;

