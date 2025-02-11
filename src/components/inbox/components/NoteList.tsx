
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import NoteItem from './NoteItem';
import type { NoteListProps } from '../types/notes';

const NoteList = ({ notes, isLoading }: NoteListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No notes yet. Add one below!
      </div>
    );
  }

  return (
    <ScrollArea className="pr-4 max-h-[300px]">
      <div className="space-y-2">
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NoteList;
