
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

interface QuickNoteInputProps {
  contactId: string;
  initialNote?: string;
  onAddNote?: (note: string) => void;
}

export const QuickNoteInput: React.FC<QuickNoteInputProps> = ({ 
  contactId, 
  initialNote = '', 
  onAddNote 
}) => {
  const [note, setNote] = useState(initialNote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    }
  }, [initialNote]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note.trim()) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(updateContact({
        contactId,
        data: { 
          notes: note // In a real app, you would append to existing notes
        }
      })).unwrap();
      
      toast({
        title: "Note added",
        description: "Your note has been added successfully",
      });
      
      if (onAddNote) {
        onAddNote(note);
      }
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
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Add a quick note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px]"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!note.trim() || isSubmitting}
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
    </form>
  );
};
