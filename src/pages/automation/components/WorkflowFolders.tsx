import * as React from 'react';
import { useState } from 'react';
import { FolderClosed, FolderOpen, Trash2, Edit, Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { WorkflowFolder } from '@/types/workflow';

interface WorkflowFoldersProps {
  folders: WorkflowFolder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFolderCreate: (folder: WorkflowFolder) => void;
  onFolderUpdate: (folder: WorkflowFolder) => void;
  onFolderDelete: (folderId: string) => void;
  className?: string;
}

export const WorkflowFolders: React.FC<WorkflowFoldersProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  className
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<WorkflowFolder | null>(null);
  const [newFolder, setNewFolder] = useState<Omit<WorkflowFolder, 'id'>>({ name: '', description: '' });

  const handleFolderSelect = (folderId: string | null) => {
    onFolderSelect(folderId);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewFolder({ name: '', description: '' });
  };

  const handleCreateFolder = () => {
    const folder: WorkflowFolder = {
      id: `folder-${Date.now()}`,
      name: newFolder.name,
      description: newFolder.description,
      workflowIds: []
    };
    onFolderCreate(folder);
    handleCloseCreateModal();
  };

  const handleOpenEditModal = (folder: WorkflowFolder) => {
    setEditingFolder(folder);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFolder(null);
  };

  const handleUpdateFolder = (updatedFolder: WorkflowFolder) => {
    onFolderUpdate(updatedFolder);
    handleCloseEditModal();
  };

  const handleOpenDeleteDialog = (folderId: string) => {
    setFolderToDelete(folderId);
  };

  const handleCloseDeleteDialog = () => {
    setFolderToDelete(null);
  };

  const handleDeleteFolder = () => {
    if (folderToDelete) {
      onFolderDelete(folderToDelete);
      handleCloseDeleteDialog();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
        <Button variant="ghost" size="sm" onClick={handleOpenCreateModal}>
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>
      
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start font-normal",
            selectedFolderId === null ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground" : "hover:bg-secondary",
          )}
          onClick={() => handleFolderSelect(null)}
        >
          All Workflows
        </Button>
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant="ghost"
            className={cn(
              "w-full justify-start font-normal",
              selectedFolderId === folder.id ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground" : "hover:bg-secondary",
            )}
            onClick={() => handleFolderSelect(folder.id)}
          >
            {selectedFolderId === folder.id ? <FolderOpen className="h-4 w-4 mr-2" /> : <FolderClosed className="h-4 w-4 mr-2" />}
            {folder.name}
            <div className="ml-auto space-x-2">
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleOpenEditModal(folder);
              }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleOpenDeleteDialog(folder.id);
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Button>
        ))}
        
        {folders.length === 0 && (
          <p className="text-sm text-center text-muted-foreground py-2">No folders created</p>
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter the details for your new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={newFolder.name}
                onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newFolder.description}
                onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen && !!editingFolder} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>
              Edit the details for the selected folder.
            </DialogDescription>
          </DialogHeader>
          {editingFolder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={editingFolder.name}
                  onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editingFolder.description || ''}
                  onChange={(e) => setEditingFolder({ ...editingFolder, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button type="button" onClick={() => editingFolder && handleUpdateFolder(editingFolder)}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!folderToDelete} onOpenChange={setFolderToDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the folder and remove all workflows from it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFolder}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
