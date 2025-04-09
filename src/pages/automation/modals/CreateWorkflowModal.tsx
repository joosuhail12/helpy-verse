
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { WorkflowTag, WorkflowFolder } from '@/types/workflow';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { WorkflowTagsControl } from '../components/WorkflowTagsControl';

export interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  folders: WorkflowFolder[];
  tags: WorkflowTag[];
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onOpenChange,
  onClose,
  folders,
  tags,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<WorkflowTag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Here you would typically save the new workflow
      console.log('Creating workflow:', { 
        name, 
        description, 
        folderId,
        tags: selectedTags 
      });
      setIsSubmitting(false);
      resetForm();
      onClose();
      toast.success('Workflow created successfully!', {
        description: `"${name}" has been created and is ready to configure.`
      });
    }, 800);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setFolderId(null);
    setSelectedTags([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl border shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-2xl font-bold">Create Workflow</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Define a new automation workflow to streamline your support processes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 p-6">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Customer Onboarding"
                className="h-11"
                required
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this workflow does"
                className="resize-none min-h-[100px]"
                rows={3}
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="folder" className="text-sm font-medium">
                Folder (optional)
              </Label>
              <Select value={folderId || ''} onValueChange={value => setFolderId(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No folder</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <Label className="text-sm font-medium">
                Tags (optional)
              </Label>
              <WorkflowTagsControl
                tags={tags}
                selectedTags={selectedTags}
                onTagsChange={(tags) => setSelectedTags(tags)}
              />
            </div>
          </div>
          
          <DialogFooter className="bg-muted/20 px-6 py-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Workflow'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
