
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import type { Content } from '@/types/content';

export const useContentShortcuts = (
  content: Content,
  editableContent: string,
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
  showDiscardDialog: () => void,
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && isEditing) {
        e.preventDefault();
        dispatch(updateContent({ 
          id: content.id, 
          updates: { content: editableContent }
        }));
        setIsEditing(false);
      }
      
      // Cancel: Esc
      if (e.key === 'Escape' && isEditing) {
        e.preventDefault();
        showDiscardDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content.id, editableContent, isEditing, dispatch, setIsEditing, showDiscardDialog]);
};
