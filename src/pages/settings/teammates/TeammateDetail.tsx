
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import TeammateDetailView from './components/detail/TeammateDetailView';
import { useTeammateDetailPage } from './hooks/useTeammateDetailPage';

/**
 * Detailed view of a specific teammate's information
 */
const TeammateDetail = () => {
  // Safely get params even if router context isn't available
  let teammateId = '';
  let navigate = null;
  
  try {
    const params = useParams();
    teammateId = params.id || '';
    navigate = useNavigate();
  } catch (error) {
    console.error("Router context not available in TeammateDetail component");
  }

  // Safe navigation function
  const safeNavigate = (path: string) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  const {
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
  } = useTeammateDetailPage(teammateId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Error Loading Teammate</h2>
        <p>{error}</p>
        <button 
          onClick={() => safeNavigate('/home/settings/teammates')}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to Teammates List
        </button>
      </div>
    );
  }

  if (!teammate) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Teammate Not Found</h2>
        <p>We couldn't find the teammate you're looking for. They may have been removed.</p>
        <button 
          onClick={() => safeNavigate('/home/settings/teammates')}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to Teammates List
        </button>
      </div>
    );
  }

  return (
    <TeammateDetailView
      teammate={teammate}
      editedTeammate={editedTeammate || teammate}
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
  );
};

export default TeammateDetail;
