
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseCustomFieldShortcutsProps {
  onCreateField: () => void;
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
  hasSelection: boolean;
}

export const useCustomFieldShortcuts = ({ 
  onCreateField, 
  onBulkEdit, 
  onBulkDelete, 
  hasSelection 
}: UseCustomFieldShortcutsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      if (document.activeElement?.tagName === 'INPUT') return;
      
      // Ctrl/Cmd + N for new field
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onCreateField();
        toast({
          title: "Keyboard Shortcut",
          description: "Create new field shortcut triggered",
        });
      }
      
      // If there's a selection, enable bulk action shortcuts
      if (hasSelection) {
        // Ctrl/Cmd + E for bulk edit
        if ((e.ctrlKey || e.metaKey) && e.key === 'e' && onBulkEdit) {
          e.preventDefault();
          onBulkEdit();
          toast({
            title: "Keyboard Shortcut",
            description: "Bulk edit shortcut triggered",
          });
        }
        // Ctrl/Cmd + D for bulk delete
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && onBulkDelete) {
          e.preventDefault();
          onBulkDelete();
          toast({
            title: "Keyboard Shortcut",
            description: "Bulk delete shortcut triggered",
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCreateField, onBulkEdit, onBulkDelete, hasSelection, toast]);
};
