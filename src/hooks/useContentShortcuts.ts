
import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import { useToast } from './use-toast';
import type { Content } from '@/types/content';

export const useContentShortcuts = (content: Content) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleAddShortcut = useCallback(async (shortcutText: string) => {
    try {
      // Update the content with the new shortcut text
      await dispatch(updateContent({
        id: content.id,
        updates: {
          content: shortcutText
        }
      })).unwrap();

      toast({
        title: 'Shortcut updated',
        description: 'The shortcut content has been updated successfully.',
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update shortcut. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [content, dispatch, toast]);

  return { handleAddShortcut };
};
