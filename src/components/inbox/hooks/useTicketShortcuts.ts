
import { useEffect } from 'react';
import type { Ticket } from '@/types/ticket';

interface UseTicketShortcutsProps {
  handleTicketSelection: (ticketId: string) => void;
  handleSort: (field: 'date' | 'priority' | 'status') => void;
  setViewMode: (mode: 'compact' | 'expanded') => void;
  markAsRead?: (ticketIds: string[]) => void;
  selectedTickets: string[];
}

export const useTicketShortcuts = ({
  handleTicketSelection,
  handleSort,
  setViewMode,
  markAsRead,
  selectedTickets,
}: UseTicketShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            handleSort('date');
            break;
          case 'p':
            e.preventDefault();
            handleSort('priority');
            break;
          case 'r':
            e.preventDefault();
            if (markAsRead && selectedTickets.length > 0) {
              markAsRead(selectedTickets);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleTicketSelection, handleSort, setViewMode, markAsRead, selectedTickets]);
};
