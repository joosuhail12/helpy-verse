
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { PencilIcon, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface CompanyNotesProps {
  company: Company;
  initialNotes?: Note[];
}

export const CompanyNotes: React.FC<CompanyNotesProps> = ({ company, initialNotes = [] }) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
      createdBy: {
        id: 'current-user',
        name: 'John Doe',
        avatar: '/assets/avatars/avatar-1.png',
      },
    };

    setNotes([note, ...notes]);
    setNewNote('');
    toast({
      title: 'Note added',
      description: 'Your note has been added successfully',
    });
  };

  const handleEditNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setEditingNote(id);
      setEditText(note.text);
    }
  };

  const saveEditedNote = () => {
    if (!editingNote || !editText.trim()) return;

    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, text: editText.trim() } 
        : note
    ));
    
    setEditingNote(null);
    setEditText('');
    
    toast({
      title: 'Note updated',
      description: 'Your note has been updated successfully',
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: 'Note deleted',
      description: 'Your note has been deleted successfully',
    });
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg">Notes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note about this company..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>
              Add Note
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                {editingNote === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingNote(null)}>
                        Cancel
                      </Button>
                      <Button onClick={saveEditedNote}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={note.createdBy.avatar} />
                          <AvatarFallback>{note.createdBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{note.createdBy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(note.createdAt))} ago
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditNote(note.id)}>
                          <PencilIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{note.text}</p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-6">
              No notes yet. Add your first note about this company.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyNotes;
