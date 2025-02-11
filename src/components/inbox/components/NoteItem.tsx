
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { NoteItemProps } from '../types/notes';

const NoteItem = ({ note }: NoteItemProps) => {
  return (
    <div className="p-3 bg-secondary/20 rounded-lg">
      <div className="text-sm">{note.content}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
      </div>
    </div>
  );
};

export default NoteItem;
