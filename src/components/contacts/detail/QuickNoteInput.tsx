
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { StickyNote, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateContact } from '@/store/slices/contacts/contactsSlice';

interface QuickNoteInputProps {
  contactId: string;
}

export const QuickNoteInput = ({ contactId }: QuickNoteInputProps) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!note.trim()) return;
    
    setIsSubmitting(true);
    try {
      dispatch(updateContact({
        id: contactId,
        notes: note,
      }));
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });
      setNote('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[80px] pr-8"
        />
        {isSubmitting ? (
          <div className="absolute right-2 top-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSubmit}
            className="absolute right-2 top-2"
            disabled={!note.trim()}
          >
            <StickyNote className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
