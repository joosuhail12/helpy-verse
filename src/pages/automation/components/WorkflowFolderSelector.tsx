import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Check,
  ChevronDown,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowFolder } from '@/types/workflow';
import { FolderOpen, FolderPlus, FolderX } from 'lucide-react';

interface WorkflowFolderSelectorProps {
  folders: WorkflowFolder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFolderCreate: (folder: WorkflowFolder) => void;
  onFolderUpdate: (folder: WorkflowFolder) => void;
  onFolderDelete: (folderId: string) => void;
  className?: string;
}

export function WorkflowFolderSelector({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  className
}: WorkflowFolderSelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [editingFolder, setEditingFolder] = useState<WorkflowFolder | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  const selectedFolder = folders.find(folder => folder.id === selectedFolderId);

  const handleCreateSubmit = () => {
    if (!folderName.trim()) return;
    
    const newFolder: WorkflowFolder = {
      id: `folder-${Date.now()}`,
      name: folderName.trim(),
      description: folderDescription.trim() || undefined,
      workflowIds: []
    };
    
    onFolderCreate(newFolder);
    setFolderName('');
    setFolderDescription('');
    setIsCreateDialogOpen(false);
  };

  const handleEditSubmit = () => {
    if (!editingFolder || !folderName.trim()) return;
    
    const updatedFolder: WorkflowFolder = {
      ...editingFolder,
      name: folderName.trim(),
      description: folderDescription.trim() || undefined
    };
    
    onFolderUpdate(updatedFolder);
    setFolderName('');
    setFolderDescription('');
    setEditingFolder(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingFolderId) {
      onFolderDelete(deletingFolderId);
      setDeletingFolderId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditFolder = (folder: WorkflowFolder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderDescription(folder.description || '');
    setIsEditDialogOpen(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    setDeletingFolderId(folderId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-between hover:bg-muted/50 border-muted-foreground/20 shadow-sm transition-all duration-200 px-3",
              selectedFolderId && "border-primary/40 bg-primary/5"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedFolderId ? (
                <>
                  <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="truncate">{selectedFolder?.name}</span>
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="text-muted-foreground">All Workflows</span>
                </>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px]" align="start">
          <DropdownMenuItem 
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              !selectedFolderId && "bg-muted/50"
            )}
            onClick={() => onFolderSelect(null)}
          >
            <div className="h-4 w-4" />
            All Workflows
            {!selectedFolderId && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
          
          {folders.length > 0 && <DropdownMenuSeparator />}
          
          <DropdownMenuGroup>
            {folders.map(folder => (
              <DropdownMenuItem 
                key={folder.id} 
                className={cn(
                  "flex items-center justify-between cursor-pointer group",
                  selectedFolderId === folder.id && "bg-muted/50"
                )}
              >
                <div 
                  className="flex items-center gap-2 flex-1 mr-2"
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="truncate">{folder.name}</span>
                  {selectedFolderId === folder.id && <Check className="h-3.5 w-3.5 ml-auto" />}
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFolder(folder);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 shrink-0" />
            Create New Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize related workflows.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="E.g., Customer Support"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder-description">Description (Optional)</Label>
              <Textarea
                id="folder-description"
                placeholder="What kind of workflows belong in this folder?"
                value={folderDescription}
                onChange={(e) => setFolderDescription(e.target.value)}
                className="resize-none h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSubmit} disabled={!folderName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-folder-name">Folder Name</Label>
              <Input
                id="edit-folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-folder-description">Description (Optional)</Label>
              <Textarea
                id="edit-folder-description"
                value={folderDescription}
                onChange={(e) => setFolderDescription(e.target.value)}
                className="resize-none h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={!folderName.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this folder? The workflows inside will not be deleted,
            but they will be moved out of this folder.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
