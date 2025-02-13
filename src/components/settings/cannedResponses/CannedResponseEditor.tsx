
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import CannedResponseEditorToolbar from './CannedResponseEditorToolbar';
import MentionList from '@/components/inbox/components/MentionList';
import { cn } from '@/lib/utils';

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
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: () => [
            { label: '@customer', value: 'customer' },
            { label: '@company', value: 'company' },
            { label: '#ticket', value: 'ticket' },
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
        placeholder: 'Type your response content here. Use @ to mention or # for ticket reference...',
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
    },
  });

  const handleInsertPlaceholder = (type: 'customer' | 'company' | 'ticket') => {
    let content = '';
    switch (type) {
      case 'customer':
        content = '@customer';
        break;
      case 'company':
        content = '@company';
        break;
      case 'ticket':
        content = '#ticket';
        break;
    }
    editor?.commands.insertContent(content);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn(
      "border rounded-md",
      disabled && "opacity-50"
    )}>
      <CannedResponseEditorToolbar 
        editor={editor}
        disabled={disabled}
        onInsertPlaceholder={handleInsertPlaceholder}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

