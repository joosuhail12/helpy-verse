
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  isSaving,
}: SnippetPreviewProps) {
  const guessLanguage = () => {
    const filename = content.title.toLowerCase();
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.java')) return 'java';
    if (filename.endsWith('.php')) return 'php';
    if (filename.endsWith('.rb')) return 'ruby';
    if (filename.endsWith('.c') || filename.endsWith('.cpp') || filename.endsWith('.h')) return 'c';
    if (filename.endsWith('.cs')) return 'csharp';
    if (filename.endsWith('.go')) return 'go';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.md')) return 'markdown';
    if (filename.endsWith('.sql')) return 'sql';
    if (filename.endsWith('.sh')) return 'bash';
    if (filename.endsWith('.xml')) return 'xml';
    if (filename.endsWith('.yml') || filename.endsWith('.yaml')) return 'yaml';
    return 'text';
  };

  const language = guessLanguage();

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Textarea
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          className="min-h-[400px] font-mono text-sm p-4"
          placeholder="Enter code snippet here..."
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  const snippetContent = content.content || '';

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setEditableContent(snippetContent)}>
          Edit
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            minHeight: '400px',
          }}
        >
          {snippetContent}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
