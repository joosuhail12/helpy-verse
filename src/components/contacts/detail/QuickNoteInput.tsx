
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addContactNote } from '@/store/slices/contacts/contactsSlice';
import { toast } from '@/hooks/use-toast';
import { Contact } from '@/types/contact';
import { v4 as uuidv4 } from 'uuid';

interface QuickNoteInputProps {
  contact: Contact;
}

export const QuickNoteInput = ({ contact }: QuickNoteInputProps) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddNote = async () => {
    if (!note.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const noteItem = {
        id: uuidv4(),
        content: note,
        createdAt: new Date().toISOString(),
        createdBy: 'Current User', // In a real app, this would come from auth state
      };
      
      await dispatch(addContactNote({
        contactId: contact.id,
        note: noteItem,
      }));
      
      setNote('');
      toast({
        title: 'Note added',
        description: 'Your note has been added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Quick Note</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Type your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <Button 
            className="w-full" 
            onClick={handleAddNote}
            disabled={!note.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
