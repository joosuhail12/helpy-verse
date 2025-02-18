
import React from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SnippetPreview } from './preview/SnippetPreview';
import { FilePreview } from './preview/FilePreview';
import { WebsitePreview } from './preview/WebsitePreview';
import { VersionHistory } from './history/VersionHistory';
import type { Content, ContentVersion } from '@/types/content';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';

interface ContentPreviewProps {
  content: Content;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editableContent, setEditableContent] = React.useState(content.content || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Create a new version
      const newVersion: ContentVersion = {
        id: `v${Date.now()}`,
        contentId: content.id,
        content: content.content || '',
        createdAt: new Date().toISOString(),
        createdBy: {
          id: 'user1',
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
        },
        changes: 'Updated content',
      };

      const updates = {
        content: editableContent,
        versions: [...(content.versions || []), newVersion],
        lastEditedBy: newVersion.createdBy,
      };

      dispatch(updateContent({ id: content.id, updates }));
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = (version: ContentVersion) => {
    setEditableContent(version.content);
    setIsEditing(true);
    toast({
      description: 'Previous version restored to editor. Click Save to apply changes.',
    });
  };

  const renderPreview = () => {
    switch (content.type) {
      case 'snippet':
        return (
          <SnippetPreview
            content={content}
            isEditing={isEditing}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            handleSave={handleSave}
            handleCancel={() => setIsEditing(false)}
            isSaving={isSaving}
          />
        );
      case 'file':
        return <FilePreview content={content} />;
      case 'website':
        return <WebsitePreview content={content} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content Preview</h3>
        {renderPreview()}
      </Card>
      
      {content.versions && content.versions.length > 0 && (
        <VersionHistory
          versions={content.versions}
          onRestore={handleRestore}
        />
      )}
    </div>
  );
};
