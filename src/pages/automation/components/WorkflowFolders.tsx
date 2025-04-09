
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FolderClosed, 
  FolderOpen, 
  ChevronRight, 
  Plus, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { WorkflowFolder } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface WorkflowFoldersProps {
  folders: WorkflowFolder[];
  onFolderCreate: (folder: WorkflowFolder) => void;
  onFolderUpdate: (folder: WorkflowFolder) => void;
  onFolderDelete: (folderId: string) => void;
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  className?: string;
}

export function WorkflowFolders({
  folders,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  selectedFolderId,
  onFolderSelect,
  className = ''
}: WorkflowFoldersProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedFolderName, setEditedFolderName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: WorkflowFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      workflowIds: []
    };
    
    onFolderCreate(newFolder);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleEditFolder = (folder: WorkflowFolder) => {
    setEditingFolderId(folder.id);
    setEditedFolderName(folder.name);
  };

  const handleSaveEdit = (folder: WorkflowFolder) => {
    if (!editedFolderName.trim()) return;
    
    onFolderUpdate({
      ...folder,
      name: editedFolderName.trim()
    });
    
    setEditingFolderId(null);
  };

  const handleSelectFolder = (folderId: string) => {
    onFolderSelect(selectedFolderId === folderId ? null : folderId);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Folders</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCreatingFolder(true)}
          className="h-7 w-7 p-0"
          disabled={isCreatingFolder}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add folder</span>
        </Button>
      </div>
      
      {/* All workflows option */}
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
          selectedFolderId === null && "bg-muted/70 font-medium"
        )}
        onClick={() => onFolderSelect(null)}
      >
        <FolderOpen className="h-4 w-4" />
        <span className="text-sm">All Workflows</span>
      </div>
      
      {/* Folder list */}
      <div className="space-y-1">
        {folders.map(folder => (
          <div key={folder.id} className="relative">
            {editingFolderId === folder.id ? (
              <div className="flex items-center gap-2 p-2">
                <Input
                  value={editedFolderName}
                  onChange={(e) => setEditedFolderName(e.target.value)}
                  className="h-7 text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(folder)}
                  onBlur={() => handleSaveEdit(folder)}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-between p-2 rounded-md group cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedFolderId === folder.id && "bg-muted/70 font-medium"
                )}
                onClick={() => handleSelectFolder(folder.id)}
              >
                <div className="flex items-center gap-2">
                  {selectedFolderId === folder.id ? (
                    <FolderOpen className="h-4 w-4" />
                  ) : (
                    <FolderClosed className="h-4 w-4" />
                  )}
                  <span className="text-sm">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({folder.workflowIds.length})
                  </span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onFolderDelete(folder.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}
        
        {isCreatingFolder && (
          <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-md">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="h-7 text-sm"
              placeholder="Folder name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') setIsCreatingFolder(false);
              }}
              onBlur={() => {
                if (newFolderName) handleCreateFolder();
                else setIsCreatingFolder(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
