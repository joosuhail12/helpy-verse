
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammateDetails } from '@/store/slices/teammates/actions';
import { selectTeammateDetails, selectTeammateDetailsLoading } from '@/store/slices/teammates/selectors';
import type { Teammate } from '@/types/teammate';
import TeammateDetailView from './components/detail/TeammateDetailView';

const TeammateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const teammate = useAppSelector(selectTeammateDetails);
  const loading = useAppSelector(selectTeammateDetailsLoading);
  
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (id) {
      dispatch(fetchTeammateDetails(id)).catch(error => {
        toast({
          title: "Error loading teammate",
          description: error.message || "Failed to load teammate details",
          variant: "destructive"
        });
      });
    }
  }, [id, dispatch, toast]);
  
  useEffect(() => {
    if (teammate) {
      setEditedTeammate(teammate);
    }
  }, [teammate]);
  
  const handleUpdateTeammate = (updates: Partial<Teammate>) => {
    if (!editedTeammate) return;
    
    setEditedTeammate({
      ...editedTeammate,
      ...updates
    });
  };
  
  const validateTeammate = () => {
    const errors: Record<string, string> = {};
    
    if (!editedTeammate?.name) {
      errors.name = "Name is required";
    }
    
    if (!editedTeammate?.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editedTeammate.email)) {
      errors.email = "Email is invalid";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateTeammate()) return;
    
    setShowConfirmDialog(true);
  };
  
  const handleConfirmSave = async () => {
    if (!editedTeammate || !id) return;
    
    setIsSaving(true);
    
    try {
      // TODO: Implement saving changes to the teammate
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      setShowConfirmDialog(false);
      
      toast({
        title: "Success",
        description: "Teammate updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update teammate",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading || !teammate || !editedTeammate) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <TeammateDetailView
      teammate={teammate}
      editedTeammate={editedTeammate}
      isEditing={isEditing}
      isSaving={isSaving}
      showConfirmDialog={showConfirmDialog}
      validationErrors={validationErrors}
      onUpdateTeammate={handleUpdateTeammate}
      onSave={handleSave}
      onCancel={() => {
        setEditedTeammate(teammate);
        setIsEditing(false);
      }}
      onConfirmSave={handleConfirmSave}
      onStartEditing={() => setIsEditing(true)}
      onCancelConfirm={() => setShowConfirmDialog(false)}
    />
  );
};

export default TeammateDetail;
