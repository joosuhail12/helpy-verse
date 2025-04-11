import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Mention, { MentionOptions } from '@tiptap/extension-mention';
import type { SuggestionProps } from '@tiptap/suggestion';
import Placeholder from '@tiptap/extension-placeholder';
import UserMentionList, { UserMentionItem } from '../components/UserMentionList';
import MentionList, { MentionItem } from '../components/MentionList';

interface EditorConfigOptions {
  placeholder?: string;
  onUpdate?: (html: string) => void;
  editable?: boolean;
}

interface CustomerMentionItem {
  id: string;
  name: string;
  company: string;
  ticketId: string;
}

const convertToMentionItem = (item: UserMentionItem | CustomerMentionItem): MentionItem => {
  if ('avatar' in item) {
    return {
      label: item.name,
      value: `@${item.id}`,
    };
  }

  const customerItem = item as CustomerMentionItem;
  return {
    label: `${customerItem.name} (${customerItem.company})`,
    value: `#${customerItem.ticketId}`,
  };
};

export const createEditorConfig = (options: EditorConfigOptions) => {
  const { placeholder, onUpdate, editable = true } = options;

  return {
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          char: '@',
          items: ({ query }: { query: string }): UserMentionItem[] => {
            return [
              { id: '1', name: 'John Doe', avatar: 'https://example.com/avatar1.jpg' },
              { id: '2', name: 'Jane Smith', avatar: 'https://example.com/avatar2.jpg' },
              { id: '3', name: 'Alex Johnson', avatar: 'https://example.com/avatar3.jpg' },
              { id: '4', name: 'Taylor Brown', avatar: 'https://example.com/avatar4.jpg' },
            ].filter(item =>
              item.name.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let component: UserMentionList;
            let popup: HTMLElement;

            return {
              onStart: (props: SuggestionProps) => {
                component = new UserMentionList({
                  items: props.items as UserMentionItem[],
                  command: props.command,
                });

                popup = document.createElement('div');
                popup.className = 'mention-popup';
                popup.appendChild(component.element);
                document.body.appendChild(popup);

                const rect = props.clientRect?.();
                if (rect) {
                  popup.style.position = 'absolute';
                  popup.style.left = `${rect.left}px`;
                  popup.style.top = `${rect.top}px`;
                  popup.style.zIndex = '1000';
                }
              },
              onUpdate: (props: SuggestionProps) => {
                component.update({ items: props.items as UserMentionItem[] });

                const rect = props.clientRect?.();
                if (rect) {
                  popup.style.position = 'absolute';
                  popup.style.left = `${rect.left}px`;
                  popup.style.top = `${rect.top}px`;
                  popup.style.zIndex = '1000';
                }
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                return component.onKeyDown(props);
              },
              onExit: () => {
                if (popup) {
                  popup.remove();
                }
              },
            };
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    editable,
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-sm max-w-none',
      },
    },
  };
};
