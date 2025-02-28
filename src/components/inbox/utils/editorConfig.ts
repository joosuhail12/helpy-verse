
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor } from '@tiptap/react';
import type { Ticket } from '@/types/ticket';
import MentionList from '../components/MentionList';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

export const createEditorConfig = (
  content: string,
  onUpdate: (editor: Editor) => void,
  ticket: Ticket
) => {
  return {
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: () => [
            { label: ticket.customer, value: 'customer' },
            { label: ticket.company || 'Company', value: 'company' },
            { label: `Ticket #${ticket.id}`, value: 'ticket' },
          ],
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },
              onUpdate: (props: any) => {
                component.updateProps(props);
                
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },
              onKeyDown: (props: any) => {
                if (props.event.key === 'Escape') {
                  popup[0].hide();
                  return true;
                }
                
                return component.ref?.onKeyDown(props);
              },
              onExit: () => {
                if (popup && popup[0]) {
                  popup[0].destroy();
                }
                if (component) {
                  component.destroy();
                }
              },
            };
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Type @ to mention customer, company, or ticket details...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => onUpdate(editor),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[100px] focus:outline-none cursor-text',
      },
    },
  };
};
