
export interface ConversationNote {
  id: string;
  ticketId: string;
  content: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInputProps {
  ticketId: string;
  onSubmit: (note: string) => void;
  isSubmitting?: boolean;
}

export interface NoteListProps {
  notes: ConversationNote[];
  isLoading?: boolean;
}

export interface NoteItemProps {
  note: ConversationNote;
}
