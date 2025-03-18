
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import type { Content, ContentComment } from '@/types/content';

interface ContentCommentsProps {
  content: Content;
}

export const ContentComments = ({ content }: ContentCommentsProps) => {
  const [comment, setComment] = useState('');
  const dispatch = useAppDispatch();

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment: ContentComment = {
      id: `comment-${Date.now()}`,
      contentId: content.id,
      text: comment.trim(),
      createdAt: new Date().toISOString(),
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=current-user',
      },
    };

    const updatedComments = [...(content.comments || []), newComment];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { comments: updatedComments }
    }));

    setComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments</h3>
      
      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handleAddComment} disabled={!comment.trim()}>
            Add Comment
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {content.comments?.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded-lg bg-secondary/50 space-y-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={comment.createdBy.avatar}
                  alt={comment.createdBy.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{comment.createdBy.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
          {!content.comments?.length && (
            <p className="text-center text-muted-foreground py-4">
              No comments yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
