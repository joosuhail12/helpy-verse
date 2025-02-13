
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Teammate } from '@/types/teammate';
import TeammateHeader from './teammates/components/TeammateHeader';
import TeammateProfileCard from './teammates/components/TeammateProfileCard';
import SaveConfirmDialog from './teammates/components/SaveConfirmDialog';
import TeammateActivityLogs from './teammates/components/TeammateActivityLogs';
import TeammatePermissions from './teammates/components/TeammatePermissions';
import TeammateAssignments from './teammates/components/TeammateAssignments';
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateTeammate } from '@/store/slices/teammatesSlice';

const TeammateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammate = useAppSelector(state => 
    state.teammates.teammates.find(t => t.id === id)
  );
  const currentUserRole = useAppSelector(state => 
    state.auth.currentUser?.role || 'viewer'
  );
  const isAdmin = currentUserRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(teammate || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!teammate || !editedTeammate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Teammate not found</p>
      </div>
    );
  }

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

  const handleSave = async () => {
    const errors = validateTeammate(editedTeammate);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
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

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <TeammateHeader
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onStartEditing={() => setIsEditing(true)}
          isSaving={isSaving}
        />

        <div className="grid gap-6">
          <TeammateProfileCard
            teammate={editedTeammate}
            isEditing={isEditing}
            onUpdateTeammate={handleUpdateTeammate}
            validationErrors={validationErrors}
            isLoading={isSaving}
          />

          {isAdmin && !isEditing && (
            <TeammatePermissions 
              teammateId={teammate.id}
              currentPermissions={teammate.permissions}
            />
          )}

          {!isEditing && (
            <TeammateAssignments 
              teammateId={teammate.id}
            />
          )}

          {!isEditing && (
            <TeammateActivityLogs 
              teammateId={teammate.id}
            />
          )}
        </div>

        <SaveConfirmDialog
          isOpen={showConfirmDialog}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmDialog(false)}
          isSaving={isSaving}
        />
      </div>
    </ScrollArea>
  );
};

export default TeammateDetail;

