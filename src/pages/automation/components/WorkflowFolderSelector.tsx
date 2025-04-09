
import React, { useState } from 'react';
import { 
  FolderClosed, 
  FolderOpen, 
  ChevronDown, 
  Plus, 
  Pencil, 
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { WorkflowFolder } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface WorkflowFolderSelectorProps {
  folders: WorkflowFolder[];
  onFolderCreate: (folder: WorkflowFolder) => void;
  onFolderUpdate: (folder: WorkflowFolder) => void;
  onFolderDelete: (folderId: string) => void;
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  className?: string;
}

export function WorkflowFolderSelector({
  folders,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  selectedFolderId,
  onFolderSelect,
  className = ''
}: WorkflowFolderSelectorProps) {
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

  const selectedFolder = selectedFolderId 
    ? folders.find(folder => folder.id === selectedFolderId) 
    : null;

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              {selectedFolderId ? (
                <>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{selectedFolder?.name}</span>
                </>
              ) : (
                <>
                  <FolderClosed className="h-4 w-4 text-muted-foreground" />
                  <span>All Workflows</span>
                </>
              )}
            </div>
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            <DropdownMenuItem 
              className={cn(
                "flex items-center gap-2",
                !selectedFolderId && "bg-muted/50 font-medium"
              )}
              onClick={() => onFolderSelect(null)}
            >
              <FolderClosed className="h-4 w-4" />
              <span>All Workflows</span>
            </DropdownMenuItem>
            
            {folders.map(folder => (
              <div key={folder.id}>
                {editingFolderId === folder.id ? (
                  <div className="p-2">
                    <div className="flex gap-2">
                      <Input
                        value={editedFolderName}
                        onChange={(e) => setEditedFolderName(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(folder);
                          if (e.key === 'Escape') setEditingFolderId(null);
                        }}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => handleSaveEdit(folder)}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2"
                        onClick={() => setEditingFolderId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <DropdownMenuItem
                    className={cn(
                      "flex items-center justify-between",
                      selectedFolderId === folder.id && "bg-muted/50 font-medium"
                    )}
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FolderOpen className="h-4 w-4 shrink-0" />
                      <span className="truncate">{folder.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({folder.workflowIds.length})
                      </span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditFolder(folder);
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFolderDelete(folder.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuItem>
                )}
              </div>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          {isCreatingFolder ? (
            <div className="p-2">
              <div className="flex gap-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder();
                    if (e.key === 'Escape') setIsCreatingFolder(false);
                  }}
                />
                <Button 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={handleCreateFolder}
                >
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2"
                  onClick={() => setIsCreatingFolder(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <DropdownMenuItem onClick={() => setIsCreatingFolder(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Folder
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
