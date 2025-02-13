
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { CannedResponse } from '@/mock/cannedResponses';

interface CreateResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (response: Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CreateResponseDialog = ({ open, onOpenChange, onCreate }: CreateResponseDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [category, setCategory] = useState('');
  const [isShared, setIsShared] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      content,
      shortcut,
      category,
      isShared,
      createdBy: 'Current User', // This would come from auth context in real app
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setShortcut('');
    setCategory('');
    setIsShared(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Canned Response</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortcut">Shortcut</Label>
            <Input
              id="shortcut"
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="shared">Share with team</Label>
            <Switch
              id="shared"
              checked={isShared}
              onCheckedChange={setIsShared}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
