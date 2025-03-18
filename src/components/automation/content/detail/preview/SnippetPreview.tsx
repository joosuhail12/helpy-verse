
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

export function SnippetPreview({
  content,
  isEditing,
  editableContent,
  setEditableContent,
  handleSave,
  handleCancel,
  isSaving
}: SnippetPreviewProps) {
  const detectLanguage = (): string => {
    // Simple heuristic to detect language based on file extension in the title or content
    const title = content.title.toLowerCase();
    
    if (title.endsWith('.js') || title.endsWith('.jsx')) return 'javascript';
    if (title.endsWith('.ts') || title.endsWith('.tsx')) return 'typescript';
    if (title.endsWith('.html')) return 'html';
    if (title.endsWith('.css')) return 'css';
    if (title.endsWith('.py')) return 'python';
    if (title.endsWith('.java')) return 'java';
    if (title.endsWith('.rb')) return 'ruby';
    if (title.endsWith('.php')) return 'php';
    if (title.endsWith('.go')) return 'go';
    if (title.endsWith('.rs')) return 'rust';
    if (title.endsWith('.c') || title.endsWith('.cpp') || title.endsWith('.h')) return 'c';
    
    // Default to javascript
    return 'javascript';
  };

  const language = detectLanguage();

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          <Textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="font-mono min-h-[300px]"
            placeholder="Enter code snippet here..."
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
        </>
      ) : (
        <>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => setEditableContent(content.content || '')}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <div className="border rounded-md overflow-hidden">
              <SyntaxHighlighter 
                language={language} 
                style={atomDark}
                customStyle={{ margin: 0, minHeight: '300px' }}
              >
                {content.content || '// No content available'}
              </SyntaxHighlighter>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
