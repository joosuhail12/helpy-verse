
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseTagShortcutsProps {
  onCreateTag: () => void;
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
  hasSelection: boolean;
}

export const useTagShortcuts = ({ 
  onCreateTag, 
  onBulkEdit, 
  onBulkDelete, 
  hasSelection 
}: UseTagShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      if (document.activeElement?.tagName === 'INPUT') return;
      
      // Ctrl/Cmd + N for new tag
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onCreateTag();
      }
      
      // If there's a selection, enable bulk action shortcuts
      if (hasSelection) {
        // Ctrl/Cmd + E for bulk edit
        if ((e.ctrlKey || e.metaKey) && e.key === 'e' && onBulkEdit) {
          e.preventDefault();
          onBulkEdit();
        }
        // Ctrl/Cmd + D for bulk delete
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && onBulkDelete) {
          e.preventDefault();
          onBulkDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCreateTag, onBulkEdit, onBulkDelete, hasSelection]);
};
