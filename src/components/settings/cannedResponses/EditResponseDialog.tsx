
import { useEffect, useState } from 'react';
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

interface EditResponseDialogProps {
  response: CannedResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (response: CannedResponse) => void;
}

export const EditResponseDialog = ({ 
  response, 
  open, 
  onOpenChange, 
  onEdit 
}: EditResponseDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [category, setCategory] = useState('');
  const [isShared, setIsShared] = useState(true);

  useEffect(() => {
    if (response) {
      setTitle(response.title);
      setContent(response.content);
      setShortcut(response.shortcut);
      setCategory(response.category);
      setIsShared(response.isShared);
    }
  }, [response]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response) return;
    
    onEdit({
      ...response,
      title,
      content,
      shortcut,
      category,
      isShared,
      updatedAt: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  if (!response) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Canned Response</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-shortcut">Shortcut</Label>
            <Input
              id="edit-shortcut"
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Input
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-shared">Share with team</Label>
            <Switch
              id="edit-shared"
              checked={isShared}
              onCheckedChange={setIsShared}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
