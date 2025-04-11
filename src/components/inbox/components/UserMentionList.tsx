import React from 'react';

export interface UserMentionItem {
    id: string;
    name: string;
    avatar?: string;
}

interface UserMentionListProps {
    items: UserMentionItem[];
    command: (item: UserMentionItem) => void;
}

class UserMentionList {
    element: HTMLElement;
    items: UserMentionItem[];
    command: (item: UserMentionItem) => void;
    selectedIndex: number;

    constructor({ items, command }: UserMentionListProps) {
        this.items = items;
        this.command = command;
        this.selectedIndex = 0;

        this.element = document.createElement('div');
        this.element.className = 'bg-white shadow-lg rounded-lg p-2 space-y-1 max-h-60 overflow-y-auto';
        this.createItems();
    }

    createItems() {
        this.element.innerHTML = '';
        this.items.forEach((item, index) => {
            const button = document.createElement('button');
            button.className = `w-full text-left px-2 py-1 rounded flex items-center ${index === this.selectedIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                }`;

            // Create avatar element if available
            if (item.avatar) {
                const avatar = document.createElement('img');
                avatar.src = item.avatar;
                avatar.className = 'w-6 h-6 rounded-full mr-2';
                avatar.alt = item.name;
                button.appendChild(avatar);
            } else {
                // Fallback avatar with initials
                const avatarFallback = document.createElement('div');
                avatarFallback.className = 'w-6 h-6 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-xs font-medium';
                avatarFallback.textContent = item.name.charAt(0).toUpperCase();
                button.appendChild(avatarFallback);
            }

            // Add name
            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;
            button.appendChild(nameSpan);

            button.onclick = () => this.selectItem(index);
            this.element.appendChild(button);
        });
    }

    selectItem(index: number) {
        this.selectedIndex = index;
        this.command(this.items[index]);
    }

    update({ items }: { items: UserMentionItem[] }) {
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

export default UserMentionList; 