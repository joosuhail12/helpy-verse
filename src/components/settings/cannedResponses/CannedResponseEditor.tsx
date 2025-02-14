
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import CannedResponseEditorToolbar from './CannedResponseEditorToolbar';
import MentionList from '@/components/inbox/components/MentionList';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';

interface CannedResponseEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export const CannedResponseEditor = ({
  content,
  onChange,
  disabled = false,
}: CannedResponseEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: () => [
            { label: '@customer.name', value: 'customer.name' },
            { label: '@customer.email', value: 'customer.email' },
            { label: '@ticket.number', value: 'ticket.number' },
            { label: '@agent.name', value: 'agent.name' },
          ],
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new MentionList({
                  items: props.items,
                  command: props.command,
                });

                popup = document.createElement('div');
                popup.className = 'mention-popup';
                popup.appendChild(component.element);
                document.body.appendChild(popup);

                popup.style.position = 'absolute';
                popup.style.left = `${props.clientRect.x}px`;
                popup.style.top = `${props.clientRect.y}px`;
              },
              onUpdate: (props: any) => {
                component.update(props);
                popup.style.left = `${props.clientRect.x}px`;
                popup.style.top = `${props.clientRect.y}px`;
              },
              onKeyDown: (props: any) => {
                if (props.event.key === 'Escape') {
                  popup.remove();
                  return true;
                }
                return component.onKeyDown(props);
              },
              onExit: () => {
                popup.remove();
              },
            };
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Type your response content here. Use @ to insert variables...',
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] focus:outline-none px-3 py-2',
      },
      handleKeyDown: (view, event) => {
        // Keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
          switch(event.key) {
            case 'b':
              event.preventDefault();
              view.dispatch(view.state.tr.setMeta('format', 'bold'));
              return true;
            case 'i':
              event.preventDefault();
              view.dispatch(view.state.tr.setMeta('format', 'italic'));
              return true;
            case 'u':
              event.preventDefault();
              view.dispatch(view.state.tr.setMeta('format', 'underline'));
              return true;
            default:
              return false;
          }
        }
        return false;
      }
    },
  });

  const getWordCount = useCallback(() => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }, [editor]);

  const getCharacterCount = useCallback(() => {
    if (!editor) return 0;
    return editor.getText().length;
  }, [editor]);

  return (
    <div className={cn(
      "border rounded-md",
      disabled && "opacity-50"
    )}>
      <CannedResponseEditorToolbar 
        editor={editor}
        disabled={disabled}
      />
      <EditorContent editor={editor} />
      <div className="px-3 py-2 border-t text-xs text-muted-foreground flex justify-between items-center">
        <div>
          Words: {getWordCount()}
        </div>
        <div>
          Characters: {getCharacterCount()}
        </div>
      </div>
    </div>
  );
};
