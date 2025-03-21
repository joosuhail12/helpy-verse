
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useToast } from '@/hooks/use-toast';
import { selectTeammateById, selectTeammatesLoading, selectTeammatesError } from '@/store/slices/teammates/selectors';
import { fetchTeammateDetails, updateTeammate } from '@/store/slices/teammates/actions';
import type { Teammate } from '@/types/teammate';
import TeammateDetailView from './components/detail/TeammateDetailView';

/**
 * TeammateDetail component displays and allows editing of a teammate's profile
 */
const TeammateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Get teammate directly from the Redux store using the memoized selector
  const teammate = useAppSelector(state => id ? selectTeammateById(state, id) : null);
  const isLoading = useAppSelector(selectTeammatesLoading);
  const error = useAppSelector(selectTeammatesError);
  
  // Local state for editing
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(teammate || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Update local state when teammate data changes in Redux
  useEffect(() => {
    if (teammate) {
      setEditedTeammate(teammate);
    }
  }, [teammate]);

  // Fetch teammate details only once on initial render
  useEffect(() => {
    if (id) {
      dispatch(fetchTeammateDetails(id));
    }
  }, [dispatch, id]);

  // Validation function
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

  // Handle updates to the edited teammate
  const handleUpdateTeammate = (updates: Partial<Teammate>) => {
    setEditedTeammate(prev => prev ? { ...prev, ...updates } : null);
    setValidationErrors({}); // Clear validation errors when user makes changes
  };

  // Handle save action
  const handleSave = () => {
    if (!editedTeammate) return;
    
    const errors = validateTeammate(editedTeammate);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setShowConfirmDialog(true);
  };

  // Handle final save after confirmation
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

  // Handle cancel action
  const handleCancel = () => {
    setEditedTeammate(teammate);
    setIsEditing(false);
    setValidationErrors({});
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading teammate details...</p>
        </div>
      </div>
    );
  }

  // Show error state
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
