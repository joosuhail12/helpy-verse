
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Bold, Italic, Underline, List, ListOrdered, Strikethrough, User, Building2, Ticket as TicketIcon } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { Ticket as TicketType } from '@/types/ticket';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  ticket: TicketType;
}

const MessageInput = ({ 
  newMessage, 
  onMessageChange, 
  onKeyPress, 
  onSendMessage,
  ticket 
}: MessageInputProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: () => [
            { label: ticket.customer, value: 'customer' },
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
        placeholder: 'Type @ to mention customer, company, or ticket details...',
      }),
    ],
    content: newMessage,
    onUpdate: ({ editor }) => {
      onMessageChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[100px] focus:outline-none cursor-text',
      },
    },
  });

  const handleEmojiSelect = (emojiData: any) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  const insertPlaceholder = (type: 'customer' | 'company' | 'ticket') => {
    let content = '';
    switch (type) {
      case 'customer':
        content = `@${ticket.customer}`;
        break;
      case 'company':
        content = `@${ticket.company}`;
        break;
      case 'ticket':
        content = `#${ticket.id}`;
        break;
    }
    editor?.commands.insertContent(content);
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="border rounded-lg mb-3">
        <div className="border-b p-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            data-active={editor?.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            data-active={editor?.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            data-active={editor?.isActive('strike')}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            data-active={editor?.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            data-active={editor?.isActive('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertPlaceholder('customer')}
            title="Mention customer"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertPlaceholder('company')}
            title="Mention company"
          >
            <Building2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertPlaceholder('ticket')}
            title="Reference ticket"
          >
            <TicketIcon className="h-4 w-4" />
          </Button>
        </div>
        <div 
          className="cursor-text"
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent 
            editor={editor} 
            className="p-3"
            onKeyDown={onKeyPress}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <EmojiPicker 
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={400}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </div>
          <Button className="gap-2" onClick={onSendMessage}>
            <Send className="h-4 w-4" />
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

class MentionList {
  element: HTMLElement;
  items: any[];
  command: any;
  selectedIndex: number;

  constructor({ items, command }: { items: any[], command: any }) {
    this.items = items;
    this.command = command;
    this.selectedIndex = 0;

    this.element = document.createElement('div');
    this.element.className = 'bg-white shadow-lg rounded-lg p-2 space-y-1';
    this.createItems();
  }

  createItems() {
    this.element.innerHTML = '';
    this.items.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = `w-full text-left px-2 py-1 rounded ${
        index === this.selectedIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
      }`;
      button.textContent = item.label;
      button.onclick = () => this.selectItem(index);
      this.element.appendChild(button);
    });
  }

  selectItem(index: number) {
    this.selectedIndex = index;
    this.command(this.items[index]);
  }

  update({ items }: { items: any[] }) {
    this.items = items;
    this.createItems();
  }

  onKeyDown({ event }: { event: KeyboardEvent }) {
    if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length;
      this.createItems();
      return true;
    }

    if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
      this.createItems();
      return true;
    }

    if (event.key === 'Enter') {
      this.selectItem(this.selectedIndex);
      return true;
    }

    return false;
  }
}

export default MessageInput;
