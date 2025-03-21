
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Teammate } from '@/types/teammate';
import TeammateHeader from './components/TeammateHeader';
import TeammateProfileCard from './components/TeammateProfileCard';
import SaveConfirmDialog from './components/SaveConfirmDialog';
import TeammateActivityLogs from './components/TeammateActivityLogs';
import TeammatePermissions from './components/TeammatePermissions';
import { TeammateAssignments } from './components/TeammateAssignments';
import TeammateSecuritySettings from './components/TeammateSecuritySettings';
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateTeammate } from '@/store/slices/teammates/actions';
import { useTeammateDetail } from '@/hooks/useTeammateDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * TeammateDetail component displays and allows editing of a teammate's profile
 */
const TeammateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Use the custom hook to fetch and manage teammate data
  const { teammate, isLoading, error } = useTeammateDetail(id);
  
  // Get current user role safely, default to 'admin' if not available
  const currentUserRole = 'admin'; // Default to admin role for now since it's not in the auth state
  
  const isAdmin = currentUserRole === 'admin';

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

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !teammate || !editedTeammate) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Teammate not found. Please go back and try again."}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/home/settings/teammates')}
            className="text-blue-500 hover:text-blue-700"
          >
            &larr; Return to Teammates List
          </button>
        </div>
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
            <TeammateSecuritySettings 
              teammateId={teammate.id}
              isEditing={isEditing}
            />
          )}

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
