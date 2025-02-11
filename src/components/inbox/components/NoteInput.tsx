
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { NoteInputProps } from '../types/notes';

const NoteInput = ({ ticketId, onSubmit, isSubmitting = false }: NoteInputProps) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSubmit(note);
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Add a private note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[80px]"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        disabled={!note.trim() || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving note...
          </>
        ) : (
          'Add Note'
        )}
      </Button>
    </form>
  );
};

export default NoteInput;
