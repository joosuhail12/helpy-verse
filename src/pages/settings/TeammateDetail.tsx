
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ArrowLeft, Mail, Calendar, Clock, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Teammate } from '@/types/teammate';

const TeammateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammate = useAppSelector(state => 
    state.teammates.teammates.find(t => t.id === id)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(teammate || null);

  if (!teammate || !editedTeammate) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/home/settings/teammates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teammates
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Teammate not found</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real implementation, this would dispatch an action to update the teammate
    toast({
      description: "Changes saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTeammate(teammate);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/home/settings/teammates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teammates
          </Button>
        </Link>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={teammate.avatar} />
              <AvatarFallback>{teammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedTeammate.name}
                    onChange={(e) => setEditedTeammate({ ...editedTeammate, name: e.target.value })}
                  />
                </div>
              ) : (
                <CardTitle className="text-2xl">{editedTeammate.name}</CardTitle>
              )}
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {isEditing ? (
                  <Input
                    value={editedTeammate.email}
                    onChange={(e) => setEditedTeammate({ ...editedTeammate, email: e.target.value })}
                  />
                ) : (
                  editedTeammate.email
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                {isEditing ? (
                  <Select
                    value={editedTeammate.role}
                    onValueChange={(value: Teammate['role']) => 
                      setEditedTeammate({ ...editedTeammate, role: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary">{editedTeammate.role}</Badge>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {isEditing ? (
                  <Select
                    value={editedTeammate.status}
                    onValueChange={(value: Teammate['status']) => 
                      setEditedTeammate({ ...editedTeammate, status: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={editedTeammate.status === 'active' ? 'default' : 'secondary'}>
                    {editedTeammate.status}
                  </Badge>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Active</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {format(new Date(editedTeammate.lastActive), 'PPpp')}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Joined</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(editedTeammate.createdAt), 'PPp')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeammateDetail;

