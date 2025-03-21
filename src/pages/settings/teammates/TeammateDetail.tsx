
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTeammateDetailPage } from './hooks/useTeammateDetailPage';
import TeammateDetailView from './components/detail/TeammateDetailView';
import TeammateDetailSkeleton from './components/detail/TeammateDetailSkeleton';

/**
 * TeammateDetail component displays and allows editing of a teammate's profile
 */
const TeammateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use the custom hook to fetch and manage teammate data
  const { 
    teammate, 
    editedTeammate,
    isLoading, 
    error,
    isEditing,
    isSaving,
    showConfirmDialog,
    validationErrors,
    handleUpdateTeammate,
    handleSave,
    handleCancel,
    handleConfirmSave,
    setIsEditing,
    setShowConfirmDialog
  } = useTeammateDetailPage(id);

  if (isLoading) {
    return <TeammateDetailSkeleton />;
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

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <TeammateDetailView
        teammate={teammate}
        editedTeammate={editedTeammate}
        isEditing={isEditing}
        isSaving={isSaving}
        showConfirmDialog={showConfirmDialog}
        validationErrors={validationErrors}
        onUpdateTeammate={handleUpdateTeammate}
        onSave={handleSave}
        onCancel={handleCancel}
        onConfirmSave={handleConfirmSave}
        onStartEditing={() => setIsEditing(true)}
        onCancelConfirm={() => setShowConfirmDialog(false)}
      />
    </ScrollArea>
  );
};

export default TeammateDetail;
