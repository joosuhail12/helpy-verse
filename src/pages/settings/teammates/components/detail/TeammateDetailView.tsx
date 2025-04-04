
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import type { Teammate } from '@/types/teammate';

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

const TeammateDetailView: React.FC<TeammateDetailViewProps> = ({
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
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/home/settings/teammates');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to Teammates
        </Button>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={isSaving}
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={onSave}
                disabled={isSaving}
              >
                <Save size={16} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={onStartEditing}
              disabled={isSaving}
            >
              <Edit2 size={16} className="mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {teammate.name || 'Teammate Details'}
          </CardTitle>
          <Badge
            className={
              teammate.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 
              teammate.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 
              'bg-gray-500 hover:bg-gray-600'
            }
          >
            {teammate.status || 'Unknown'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={isEditing ? editedTeammate.name || '' : teammate.name || ''}
                  onChange={e => onUpdateTeammate({ name: e.target.value })}
                  disabled={!isEditing}
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedTeammate.email || '' : teammate.email || ''}
                  onChange={e => onUpdateTeammate({ email: e.target.value })}
                  disabled={!isEditing}
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={isEditing ? editedTeammate.role || '' : teammate.role || ''}
                  onChange={e => onUpdateTeammate({ role: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="team">Team</Label>
                <Input
                  id="team"
                  value={isEditing ? editedTeammate.team || '' : teammate.team || ''}
                  onChange={e => onUpdateTeammate({ team: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={isEditing ? editedTeammate.department || '' : teammate.department || ''}
                  onChange={e => onUpdateTeammate({ department: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={isEditing ? editedTeammate.status || '' : teammate.status || ''}
                  onChange={e => onUpdateTeammate({ status: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={isEditing ? editedTeammate.notes || '' : teammate.notes || ''}
              onChange={e => onUpdateTeammate({ notes: e.target.value })}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={onCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to the teammate's information?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelConfirm}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeammateDetailView;
