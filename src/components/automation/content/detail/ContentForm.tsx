
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentComment, ContentVersion, Content, User } from '@/types/content';

interface ContentFormProps {
  content: Content;
  onUpdate: (content: Partial<Content>) => void;
  categories: string[];
  currentUser: User;
  isSubmitting?: boolean;
}

export const ContentForm = ({
  content,
  onUpdate,
  categories,
  currentUser,
  isSubmitting = false,
}: ContentFormProps) => {
  const [title, setTitle] = useState(content.title);
  const [description, setDescription] = useState(content.description);
  const [category, setCategory] = useState(content.category);
  const [contentText, setContentText] = useState(content.content || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    // Create a new version
    const newVersion: Partial<ContentVersion> = {
      content: content.content || '',
      createdAt: new Date().toISOString(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || '',
      },
      changeDescription: 'Manual save',
    };
    
    // Update the content
    onUpdate({
      title,
      description,
      category,
      content: contentText,
      lastUpdated: new Date().toISOString(),
      lastEditedBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || '',
      },
      versions: [...(content.versions || []), newVersion as ContentVersion],
    });
    
    setIsEditing(false);
    
    toast({
      title: 'Success',
      description: 'Content updated successfully',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            rows={10}
            className="font-mono"
            disabled={!isEditing}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setTitle(content.title);
                setDescription(content.description);
                setCategory(content.category);
                setContentText(content.content || '');
                setIsEditing(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
