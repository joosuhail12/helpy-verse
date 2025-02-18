
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addAction } from '@/store/slices/actions/actionsSlice';
import type { CustomAction } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';

interface CreateActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateActionDialog({ open, onOpenChange }: CreateActionDialogProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [endpoint, setEndpoint] = useState('');

  const handleSubmit = () => {
    const newAction: CustomAction = {
      id: uuidv4(),
      name,
      description,
      endpoint,
      method: 'GET',
      parameters: [],
      headers: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: '1',
        name: 'Current User',
      },
      enabled: true,
    };

    dispatch(addAction(newAction));
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEndpoint('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Action</DialogTitle>
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
          <Button onClick={handleSubmit}>Create Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
