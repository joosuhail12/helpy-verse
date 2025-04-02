
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
import { useTeammateDetail } from '@/hooks/useTeammateDetail';
import { updateTeammate } from '@/store/slices/teammates/actions';
import type { Teammate } from '@/types/teammate';

export const useTeammateDetailPage = (teammateId?: string) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Use the existing hook to fetch teammate data
  const { teammate, isLoading, error } = useTeammateDetail(teammateId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(teammate || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update edited teammate when teammate changes
  useEffect(() => {
    if (teammate) {
      setEditedTeammate(teammate);
    }
  }, [teammate]);

  const validateTeammate = (teammate: Teammate) => {
    const errors: Record<string, string> = {};
    if (!teammate.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!teammate.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teammate.email)) {
      errors.email = 'Invalid email format';
    }
    return errors;
  };

  const handleSave = () => {
    if (!editedTeammate) return;
    
    const errors = validateTeammate(editedTeammate);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!editedTeammate) return;
    
    setIsSaving(true);
    try {
      await dispatch(updateTeammate(editedTeammate)).unwrap();
      
      toast({
        description: "Changes saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setEditedTeammate(teammate);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleUpdateTeammate = (updates: Partial<Teammate>) => {
    setEditedTeammate(prev => prev ? { ...prev, ...updates } : null);
    setValidationErrors({}); // Clear validation errors when user makes changes
  };

  return {
    teammate,
    editedTeammate,
    isLoading,
    error,
    isEditing,
    isSaving,
    showConfirmDialog,
    validationErrors,
    setIsEditing,
    setShowConfirmDialog,
    handleUpdateTeammate,
    handleSave,
    handleCancel,
    handleConfirmSave
  };
};
