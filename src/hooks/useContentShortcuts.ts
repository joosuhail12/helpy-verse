
import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import { useToast } from './use-toast';
import type { Content } from '@/types/content';

export const useContentShortcuts = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const updateContentField = useCallback(async (
    contentId: string, 
    fieldName: string, 
    value: any
  ) => {
    try {
      await dispatch(updateContent({
        id: contentId,
        data: { [fieldName]: value }
      })).unwrap();
      
      toast({
        title: 'Content updated',
        description: `Successfully updated ${fieldName}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Update failed',
        description: `Failed to update ${fieldName}`,
        variant: 'destructive',
      });
      
      return false;
    }
  }, [dispatch, toast]);

  return {
    updateContentField
  };
};
