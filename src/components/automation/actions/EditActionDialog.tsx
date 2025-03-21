
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateAction } from '@/store/slices/actions/actionsSlice';
import type { CustomAction } from '@/types/action';

interface EditActionDialogProps {
  action: CustomAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditActionDialog({ action, open, onOpenChange }: EditActionDialogProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(action.name);
  const [description, setDescription] = useState(action.description);
  const [endpoint, setEndpoint] = useState(action.endpoint);

  useEffect(() => {
    setName(action.name);
    setDescription(action.description);
    setEndpoint(action.endpoint);
  }, [action]);

  const handleSubmit = () => {
    const updatedAction: CustomAction = {
      ...action,
      name,
      description,
      endpoint,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateAction(updatedAction));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Action</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="endpoint" className="text-sm font-medium">Endpoint</label>
            <input
              id="endpoint"
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
