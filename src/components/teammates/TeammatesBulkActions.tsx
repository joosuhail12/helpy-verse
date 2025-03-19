
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronDown, Users, UserX, UserCheck, Download, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Teammate, TeammateRole } from '@/types/teammate';

// Mock functions - replace with actual implementations
const bulkUpdateRole = (ids: string[], role: TeammateRole) => ({});
const bulkSuspendTeammates = (ids: string[]) => ({});
const bulkActivateTeammates = (ids: string[]) => ({});
const bulkExportTeammates = (ids: string[], format: 'csv' | 'json') => ({});

interface TeammatesBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

const TeammatesBulkActions = ({ selectedIds, onClearSelection }: TeammatesBulkActionsProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleRoleUpdate = async (role: TeammateRole) => {
    try {
      await dispatch(bulkUpdateRole({ 
        ids: selectedIds,
        role 
      }));
      toast({
        title: "Success",
        description: `Updated ${selectedIds.length} teammate(s) to ${role} role.`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update roles. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async () => {
    try {
      await dispatch(bulkSuspendTeammates(selectedIds));
      toast({
        title: "Success",
        description: `Suspended ${selectedIds.length} teammate(s).`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend teammates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async () => {
    try {
      await dispatch(bulkActivateTeammates(selectedIds));
      toast({
        title: "Success",
        description: `Activated ${selectedIds.length} teammate(s).`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate teammates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await dispatch(bulkExportTeammates(selectedIds, format as any));
      toast({
        title: "Success",
        description: `Exported ${selectedIds.length} teammate(s) as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export teammates. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-primary" />
        <span className="font-medium">{selectedIds.length} teammate(s) selected</span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>Clear</Button>
      </div>
      
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Set Role <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleRoleUpdate('admin')}>Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleUpdate('supervisor')}>Supervisor</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleUpdate('agent')}>Agent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleUpdate('viewer')}>Viewer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleActivate}>
              <UserCheck className="mr-2 h-4 w-4" /> Activate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSuspend}>
              <UserX className="mr-2 h-4 w-4" /> Suspend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <Download className="mr-2 h-4 w-4" /> Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              <Download className="mr-2 h-4 w-4" /> Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm"
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => setShowDeleteDialog(true)}
        >
          <XCircle className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected teammates and remove all their data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
              Delete Teammates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeammatesBulkActions;
