
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ConversationNote } from '../types/notes';

export const useConversationNotes = (ticketId: string) => {
  const [notes, setNotes] = useState<ConversationNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('conversation_notes')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data.map(note => ({
          id: note.id,
          ticketId: note.ticket_id,
          content: note.content,
          agentId: note.agent_id,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
        })));
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          variant: "destructive",
          description: "Failed to load notes. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();

    // Set up realtime subscription
    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_notes',
          filter: `ticket_id=eq.${ticketId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNote = payload.new;
            setNotes(prev => [{
              id: newNote.id,
              ticketId: newNote.ticket_id,
              content: newNote.content,
              agentId: newNote.agent_id,
              createdAt: newNote.created_at,
              updatedAt: newNote.updated_at,
            }, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, toast]);

  const addNote = async (content: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('conversation_notes')
        .insert([
          {
            ticket_id: ticketId,
            content,
            agent_id: 'Agent', // In a real app, this would be the actual agent ID
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Note added successfully"
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        variant: "destructive",
        description: "Failed to add note. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    notes,
    isLoading,
    isSubmitting,
    addNote
  };
};
