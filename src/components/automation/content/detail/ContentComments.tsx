
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ContentComment, User } from '@/types/content';

interface ContentCommentsProps {
  comments: ContentComment[];
  onAddComment: (comment: Partial<ContentComment>) => void;
  currentUser: User;
}

export const ContentComments = ({ comments, onAddComment, currentUser }: ContentCommentsProps) => {
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    onAddComment({
      content: comment,
      createdAt: new Date().toISOString(),
      user: currentUser,
    });
    
    setComment('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Add the first comment.
        </div>
        <div className="flex gap-2 mt-4">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px]"
          />
          <Button size="icon" onClick={handleAddComment} disabled={!comment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => {
          const user = comment.user || comment.createdBy;
          return (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  {comment.content || comment.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-4">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[80px]"
        />
        <Button size="icon" onClick={handleAddComment} disabled={!comment.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
