
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface NoteInputProps {
  onAddNote: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

const NoteInput = ({ onAddNote, isSubmitting }: NoteInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    await onAddNote(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <Textarea
        placeholder="Add an internal note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] mb-2"
      />
      <Button 
        type="submit" 
        disabled={!content.trim() || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding note...
          </>
        ) : (
          'Add Note'
        )}
      </Button>
    </form>
  );
};

export default NoteInput;

