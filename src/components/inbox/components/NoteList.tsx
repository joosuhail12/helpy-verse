
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Clock } from 'lucide-react';
import type { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  isLoading?: boolean;
}

const NoteList = ({ notes, isLoading }: NoteListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        Loading notes...
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        No internal notes yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] p-4">
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-3">
            <Avatar className="h-6 w-6">
              <span className="text-xs">{note.agentName[0]}</span>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{note.agentName}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 text-sm bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-2">
                {note.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NoteList;

