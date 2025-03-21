
import React, { useRef, useState } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Prism from 'prismjs';
import type { Content } from '@/types/content';

interface SnippetPreviewProps {
  content: Content;
  isEditing: boolean;
  editableContent: string;
  setEditableContent: (content: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  isSaving: boolean;
}

export const SnippetPreview = ({
  content,
  isEditing,
  editableContent,
  setEditableContent,
  handleSave,
  handleCancel,
  isSaving
}: SnippetPreviewProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    if (preRef.current) {
      Prism.highlightElement(preRef.current);
    }
  }, [content.content, isEditing]);

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
        <Button onClick={() => setEditableContent(content.content || '')}>
          Edit Content
        </Button>
      </div>
    </div>
  );
};
