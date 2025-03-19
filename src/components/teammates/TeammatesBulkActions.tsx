
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateTeammatesRole, exportTeammates } from '@/store/slices/teammates/actions';
import { CheckSquare, UserMinus, FileText } from 'lucide-react';
import type { TeammateRole } from '@/types/teammate';

interface TeammatesBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

const TeammatesBulkActions = ({ selectedIds, onClearSelection }: TeammatesBulkActionsProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<TeammateRole>('agent');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleRoleChange = async () => {
    try {
      const resultAction = await dispatch(updateTeammatesRole({ teammateIds: selectedIds, role: newRole }));
      
      if (updateTeammatesRole.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Role updated for selected teammates",
        });
        setShowRoleDialog(false);
        onClearSelection();
      } else {
        toast({
          title: "Error",
          description: "Failed to update roles. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update roles. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const resultAction = await dispatch(exportTeammates(selectedIds));
      
      if (exportTeammates.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Export completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export teammates. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export teammates. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
        <CheckSquare className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">{selectedIds.length} teammates selected</span>
        
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRoleDialog(true)}
          >
            Change Role
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirmDialog(true)}
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Deactivate
          </Button>
        </div>
      </div>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role for Selected Teammates</DialogTitle>
            <DialogDescription>
              Select a new role for the {selectedIds.length} selected teammate(s).
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={(value: TeammateRole) => setNewRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deactivation</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {selectedIds.length} teammate(s)? This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              // Implement deactivation logic here
              setShowConfirmDialog(false);
            }}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeammatesBulkActions;
