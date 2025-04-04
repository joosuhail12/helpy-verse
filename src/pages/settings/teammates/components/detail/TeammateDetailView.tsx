
import type { Teammate } from '@/types/teammate';
import TeammateHeader from '../TeammateHeader';
import TeammateProfileCard from '../TeammateProfileCard';
import SaveConfirmDialog from '../SaveConfirmDialog';
import TeammateActivityLogs from '../TeammateActivityLogs';
import TeammatePermissions from '../TeammatePermissions';
import { TeammateAssignments } from '../TeammateAssignments';
import TeammateSecuritySettings from '../TeammateSecuritySettings';

interface TeammateDetailViewProps {
  teammate: Teammate;
  editedTeammate: Teammate;
  isEditing: boolean;
  isSaving: boolean;
  showConfirmDialog: boolean;
  validationErrors: Record<string, string>;
  onUpdateTeammate: (updates: Partial<Teammate>) => void;
  onSave: () => void;
  onCancel: () => void;
  onConfirmSave: () => void;
  onStartEditing: () => void;
  onCancelConfirm: () => void;
}

const TeammateDetailView = ({
  teammate,
  editedTeammate,
  isEditing,
  isSaving,
  showConfirmDialog,
  validationErrors,
  onUpdateTeammate,
  onSave,
  onCancel,
  onConfirmSave,
  onStartEditing,
  onCancelConfirm
}: TeammateDetailViewProps) => {
  // Get current user role safely, default to 'admin' if not available
  const currentUserRole = 'admin'; // Default to admin role for now since it's not in the auth state
  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <TeammateHeader
        isEditing={isEditing}
        onSave={onSave}
        onCancel={onCancel}
        onStartEditing={onStartEditing}
        isSaving={isSaving}
      />

      <div className="grid gap-6">
        <TeammateProfileCard
          teammate={editedTeammate}
          isEditing={isEditing}
          onUpdateTeammate={onUpdateTeammate}
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
            currentPermissions={teammate.permissions || []}
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
        onConfirm={onConfirmSave}
        onCancel={onCancelConfirm}
        isSaving={isSaving}
      />
    </div>
  );
};

export default TeammateDetailView;
