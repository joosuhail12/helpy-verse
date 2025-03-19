
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { X, Plus, Search } from 'lucide-react';
import { User } from '@/types/content';

interface ContentSharingProps {
  sharedWith: User[];
  onShare: (users: User[]) => void;
  availableUsers: User[];
}

export const ContentSharing = ({ sharedWith = [], onShare, availableUsers = [] }: ContentSharingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('viewer');

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = sharedWith.filter(user => user.id !== userId);
    onShare(updatedUsers);
    
    toast({
      title: 'User removed',
      description: 'User has been removed from sharing',
    });
  };

  const handleAddUser = () => {
    if (!selectedUser) {
      toast({
        title: 'Select a user',
        description: 'Please select a user to share with',
        variant: 'destructive',
      });
      return;
    }
    
    const userToAdd = availableUsers.find(user => user.id === selectedUser);
    if (!userToAdd) return;
    
    if (sharedWith.some(user => user.id === selectedUser)) {
      toast({
        title: 'Already shared',
        description: 'This content is already shared with this user',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedUsers = [...sharedWith, { ...userToAdd, role: selectedRole as 'viewer' | 'editor' | 'admin' }];
    onShare(updatedUsers);
    
    setSelectedUser('');
    
    toast({
      title: 'Shared successfully',
      description: `Content has been shared with ${userToAdd.name}`,
    });
  };

  const filteredUsers = availableUsers.filter(user => 
    !sharedWith.some(sharedUser => sharedUser.id === user.id) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <div className="py-2 px-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <ScrollArea className="h-[200px]">
                  {filteredUsers.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Shared with</h3>
          {sharedWith.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              This content is not shared with anyone
            </div>
          ) : (
            <div className="space-y-2">
              {sharedWith.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs px-2 py-1 bg-muted-foreground/20 rounded">
                      {user.role || 'Viewer'}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
