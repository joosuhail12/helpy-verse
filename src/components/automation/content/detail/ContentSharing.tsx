
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Share2, X } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import type { Content } from '@/types/content';

interface ContentSharingProps {
  content: Content;
}

export const ContentSharing = ({ content }: ContentSharingProps) => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleShare = () => {
    if (!email.trim()) return;

    const newSharedUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`,
      role: 'viewer' as const,
    };

    const updatedSharedWith = [...(content.sharedWith || []), newSharedUser];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { sharedWith: updatedSharedWith }
    }));

    setEmail('');
    toast({
      title: 'Shared successfully',
      description: `Content shared with ${email}`,
    });
  };

  const handleRemoveShare = (userId: string) => {
    const updatedSharedWith = content.sharedWith?.filter(user => user.id !== userId) || [];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { sharedWith: updatedSharedWith }
    }));

    toast({
      title: 'Share removed',
      description: 'User has been removed from shared list',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Share</h3>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter email to share"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleShare} disabled={!email.trim()}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {content.sharedWith && content.sharedWith.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm text-muted-foreground">Shared with:</h4>
          <div className="space-y-2">
            {content.sharedWith.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">({user.role})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveShare(user.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
