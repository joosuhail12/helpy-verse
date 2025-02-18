
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import { Copy, Check, Loader2 } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import { useContentShortcuts } from '@/hooks/useContentShortcuts';
import { DiscardChangesDialog } from './DiscardChangesDialog';
import type { Content } from '@/types/content';

interface ContentPreviewProps {
  content: Content;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [editableContent, setEditableContent] = React.useState(content.content || '');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle autosave for snippets
  useEffect(() => {
    if (content.type === 'snippet' && isEditing) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000); // Autosave after 2 seconds of no typing
    }
    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [editableContent]);

  // Cleanup autosave on unmount
  useEffect(() => {
    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (content.type === 'snippet' && preRef.current) {
      Prism.highlightElement(preRef.current);
    }
  }, [content.content, content.type, isEditing]);

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

  const copyToClipboard = async () => {
    if (content.content) {
      try {
        await navigator.clipboard.writeText(content.content);
        setIsCopied(true);
        toast({
          title: "Copied!",
          description: "Content copied to clipboard",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy content",
          variant: "destructive",
        });
      }
    }
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
    if (content.type === 'snippet') {
      if (isEditing) {
        return (
          <div className="space-y-4">
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <div className="relative">
            <pre ref={preRef} className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md overflow-x-auto">
              <code className="language-javascript">
                {content.content}
              </code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              Edit Content
            </Button>
          </div>
        </div>
      );
    }

    if (content.type === 'website' && content.content) {
      return (
        <div className="space-y-4">
          <div className="aspect-video w-full border rounded-lg overflow-hidden">
            <iframe
              src={content.content}
              className="w-full h-full"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <p className="text-sm text-muted-foreground break-all">
            URL: {content.content}
          </p>
        </div>
      );
    }

    if (content.type === 'file' && content.content) {
      const fileExtension = content.content.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf') {
        return (
          <div className="aspect-[4/3] w-full border rounded-lg overflow-hidden">
            <iframe
              src={content.content}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        );
      }

      return (
        <div className="text-center py-8">
          <a
            href={content.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Open Document
          </a>
        </div>
      );
    }

    return (
      <p className="text-muted-foreground text-center py-8">
        No content available for preview
      </p>
    );
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
