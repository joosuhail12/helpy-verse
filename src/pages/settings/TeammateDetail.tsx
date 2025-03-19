
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
import { TeammateAssignments } from './teammates/components/TeammateAssignments';
import TeammateSecuritySettings from './teammates/components/TeammateSecuritySettings';
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateTeammate } from '@/store/slices/teammates/actions';

const TeammateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Get the teammate from the store
  const teammatesState = useAppSelector(state => state.teammates);
  const teammate = teammatesState?.items?.find(t => t.id === id);
  
  // Get current user role safely, default to 'viewer' if not available
  const authUser = useAppSelector(state => state.auth.user);
  const currentUserRole = 'admin'; // Default to admin role for now since it's not in the auth state
  
  const isAdmin = currentUserRole === 'admin';

  // If we have the teammate from Redux, add default permissions if missing
  const teammateWithDefaults = teammate ? {
    ...teammate,
    permissions: teammate.permissions || []
  } : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(teammateWithDefaults);
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
      // Update the teammate with the correct parameter structure
      await dispatch(updateTeammate({
        id: editedTeammate.id,
        data: {
          name: editedTeammate.name,
          email: editedTeammate.email,
          role: editedTeammate.role,
          status: editedTeammate.status,
          permissions: editedTeammate.permissions,
          teams: editedTeammate.teams
        }
      })).unwrap();
      
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
    setEditedTeammate(teammateWithDefaults);
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
            <TeammateSecuritySettings 
              teammateId={teammate.id}
              isEditing={isEditing}
            />
          )}

          {isAdmin && !isEditing && (
            <TeammatePermissions 
              teammateId={teammate.id}
              currentPermissions={editedTeammate.permissions || []}
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
