
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Contact } from '@/types/contact';
import type { User } from '@/types/content';

interface ContactNotesProps {
  contact: Contact;
  onAddNote?: (note: string) => void;
  currentUser: User;
}

export const ContactNotes = ({ contact, onAddNote, currentUser }: ContactNotesProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Handle case where notes might be a string instead of an array
  const notes = Array.isArray(contact.notes) ? contact.notes : [];

  const handleAddNote = () => {
    if (noteText.trim() && onAddNote) {
      onAddNote(noteText);
      setNoteText('');
      setIsAddingNote(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        {!isAddingNote && (
          <Button variant="outline" size="sm" onClick={() => setIsAddingNote(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingNote ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                Save Note
              </Button>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notes yet. Click "Add Note" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">
                    {note.createdBy ? note.createdBy : currentUser.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap">{note.content}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
