
import React from 'react';

export interface MentionItem {
  label: string;
  value: string;
}

interface MentionListProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
}

class MentionList {
  element: HTMLElement;
  items: MentionItem[];
  command: (item: MentionItem) => void;
  selectedIndex: number;

  constructor({ items, command }: MentionListProps) {
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

  update({ items }: { items: MentionItem[] }) {
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

export default MentionList;
