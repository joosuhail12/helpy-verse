
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface LastEditedByProps {
  editor: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastUpdated: string;
}

export const LastEditedBy = ({ editor, lastUpdated }: LastEditedByProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Avatar className="h-6 w-6">
        <AvatarImage src={editor.avatar} />
        <AvatarFallback>{editor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>
        Last edited by <span className="font-medium text-foreground">{editor.name}</span>{' '}
        {formatDistanceToNow(new Date(lastUpdated))} ago
      </span>
    </div>
  );
};
