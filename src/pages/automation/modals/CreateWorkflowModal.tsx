
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
import { Workflow, WorkflowTag, WorkflowFolder } from '@/types/workflow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onWorkflowCreated?: (workflow: Workflow) => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onOpenChange,
  onClose,
  onWorkflowCreated
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Workflow['type']>('automation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new workflow object
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description: description.trim() || undefined,
      status: 'Draft',
      type,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      resetForm();
      onClose();
      
      if (onWorkflowCreated) {
        onWorkflowCreated(newWorkflow);
      } else {
        toast.success('Workflow created successfully!', {
          description: `"${name}" has been created and is ready to configure.`
        });
      }
    }, 800);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('automation');
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
              <Label htmlFor="type" className="text-sm font-medium">
                Type
              </Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as Workflow['type'])}
              >
                <SelectTrigger id="type" className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="bot">Bot</SelectItem>
                </SelectContent>
              </Select>
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
