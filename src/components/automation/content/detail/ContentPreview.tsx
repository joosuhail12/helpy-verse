
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import { useContentShortcuts } from '@/hooks/useContentShortcuts';
import { DiscardChangesDialog } from './DiscardChangesDialog';
import { SnippetPreview } from './preview/SnippetPreview';
import { WebsitePreview } from './preview/WebsitePreview';
import { FilePreview } from './preview/FilePreview';
import type { Content } from '@/types/content';

interface ContentPreviewProps {
  content: Content;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [editableContent, setEditableContent] = useState(content.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle autosave for snippets
  useEffect(() => {
    if (content.type === 'snippet' && isEditing) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000);
    }
    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [editableContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateContent({ 
        id: content.id, 
        updates: { content: editableContent }
      }));
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (editableContent !== content.content) {
      setShowDiscardDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleDiscardChanges = () => {
    setEditableContent(content.content || '');
    setIsEditing(false);
    setShowDiscardDialog(false);
  };

  // Set up keyboard shortcuts
  useContentShortcuts(
    content,
    editableContent,
    isEditing,
    setIsEditing,
    () => setShowDiscardDialog(true)
  );

  const renderContent = () => {
    switch (content.type) {
      case 'snippet':
        return (
          <SnippetPreview
            content={content}
            isEditing={isEditing}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            handleSave={handleSave}
            handleCancel={handleCancel}
            isSaving={isSaving}
          />
        );
      case 'website':
        return <WebsitePreview content={content} />;
      case 'file':
        return <FilePreview content={content} />;
      default:
        return (
          <p className="text-muted-foreground text-center py-8">
            No content available for preview
          </p>
        );
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Content Preview</h3>
      {renderContent()}
      <DiscardChangesDialog
        isOpen={showDiscardDialog}
        onConfirm={handleDiscardChanges}
        onCancel={() => setShowDiscardDialog(false)}
      />
    </Card>
  );
};
