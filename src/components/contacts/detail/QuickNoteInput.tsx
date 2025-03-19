
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import type { QuickNoteInputProps } from '@/types/contact';

export const QuickNoteInput = ({ contact }: QuickNoteInputProps) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a new note
      const newNote = {
        id: uuidv4(),
        content: note,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user' // This would be dynamic in real app
      };
      
      // Add it to existing notes
      const updatedNotes = contact.notes ? [...contact.notes, newNote] : [newNote];
      
      // Update the contact
      await dispatch(updateContact({
        contactId: contact.id,
        data: { notes: updatedNotes }
      }));
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      
      setNote('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add a quick note about this contact..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting || !note.trim()}>
        {isSubmitting ? 'Adding...' : 'Add Note'}
      </Button>
    </form>
  );
};
