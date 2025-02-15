
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { StickyNote, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
      // TODO: Implement note creation dispatch action
      // For now just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      });
      setNote('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a quick note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[80px]"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting || !note.trim()}
        className="w-full"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <StickyNote className="h-4 w-4 mr-2" />
        )}
        Add Note
      </Button>
    </div>
  );
};
