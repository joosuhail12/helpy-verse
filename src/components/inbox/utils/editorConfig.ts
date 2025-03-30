import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor } from '@tiptap/react';
import type { Ticket } from '@/types/ticket';
import MentionList from '../components/MentionList';
import { useCustomer } from '@/hooks/use-customer';

export const createEditorConfig = (
  content: string,
  onUpdate: (editor: Editor) => void,
  ticket: Ticket,
  customerName?: string
) => {
  const displayName = customerName || ticket.customer || `Customer ${ticket.customerId ? `(${ticket.customerId})` : ''}`;

  return {
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: () => [
            { label: displayName, value: 'customer' },
            { label: ticket.company, value: 'company' },
            { label: `Ticket #${ticket.id}`, value: 'ticket' },
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
        placeholder: `Type your reply to ${displayName} here...`,
      }),
    ],
    content,
    onUpdate: ({ editor }) => onUpdate(editor),
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none w-full max-w-full',
        spellcheck: 'true',
      },
    },
  };
};
