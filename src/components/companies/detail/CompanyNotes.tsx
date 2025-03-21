
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Send, Loader2 } from 'lucide-react';

interface CompanyNotesProps {
  company: any; // Replace with actual Company type
  initialNotes?: any[];
}

export const CompanyNotes: React.FC<CompanyNotesProps> = ({ company, initialNotes = [] }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock API call to add note
      await new Promise(resolve => setTimeout(resolve, 500));

      const note = {
        id: `note-${Date.now()}`,
        text: newNote,
        createdAt: new Date().toISOString(),
        createdBy: {
          name: 'Current User',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=currentUser',
        },
      };

      setNotes([note, ...notes]);
      setNewNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg bg-secondary/50 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={note.createdBy.avatar}
                    alt={note.createdBy.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">{note.createdBy.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(note.createdAt))} ago
                  </span>
                </div>
                <p className="text-sm">{note.text}</p>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No notes yet. Add the first one!
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CompanyNotes;
