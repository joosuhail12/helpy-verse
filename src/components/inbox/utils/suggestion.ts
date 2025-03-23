import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import type { Ticket } from '@/types/ticket';
import MentionList from '../components/MentionList';

/**
 * Creates a suggestion configuration for the Mention extension
 */
const suggestion = (ticket: Ticket) => ({
  items: ({ query }: { query: string }) => {
    const companyName = typeof ticket.company === 'string' 
      ? ticket.company.toLowerCase() 
      : ticket.company?.name?.toLowerCase() || '';
    
    const items = [
      { label: ticket.customer, value: 'customer' },
      { label: companyName, value: 'company' },
      { label: `Ticket #${ticket.id}`, value: 'ticket' },
    ];
    
    return items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  },
  
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
});

export default suggestion;
