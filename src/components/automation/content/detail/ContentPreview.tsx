
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import type { Content } from '@/types/content';

interface ContentPreviewProps {
  content: Content;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [editableContent, setEditableContent] = React.useState(content.content || '');
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSave = () => {
    dispatch(updateContent({ 
      id: content.id, 
      updates: { content: editableContent }
    }));
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Content updated successfully",
    });
  };

  const renderContent = () => {
    if (content.type === 'snippet') {
      if (isEditing) {
        return (
          <div className="space-y-4">
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
            {content.content}
          </pre>
          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              Edit Content
            </Button>
          </div>
        </div>
      );
    }

    return (
      <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
        {content.content}
      </pre>
    );
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Content Preview</h3>
      {content.content ? (
        renderContent()
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No content available for preview
        </p>
      )}
    </Card>
  );
};
