
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Teammate } from '@/types/teammate';

interface TeammateProfileCardProps {
  teammate: Teammate;
  isEditing: boolean;
  onUpdateTeammate: (updates: Partial<Teammate>) => void;
}

const TeammateProfileCard = ({
  teammate,
  isEditing,
  onUpdateTeammate,
}: TeammateProfileCardProps) => {
  return (
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
                value={teammate.name}
                onChange={(e) => onUpdateTeammate({ name: e.target.value })}
              />
            </div>
          ) : (
            <CardTitle className="text-2xl">{teammate.name}</CardTitle>
          )}
          <CardDescription className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {isEditing ? (
              <Input
                value={teammate.email}
                onChange={(e) => onUpdateTeammate({ email: e.target.value })}
              />
            ) : (
              teammate.email
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
                value={teammate.role}
                onValueChange={(value: Teammate['role']) => 
                  onUpdateTeammate({ role: value })
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
              <Badge variant="secondary">{teammate.role}</Badge>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            {isEditing ? (
              <Select
                value={teammate.status}
                onValueChange={(value: Teammate['status']) => 
                  onUpdateTeammate({ status: value })
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
              <Badge variant={teammate.status === 'active' ? 'default' : 'secondary'}>
                {teammate.status}
              </Badge>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Active</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {format(new Date(teammate.lastActive), 'PPpp')}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Joined</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {format(new Date(teammate.createdAt), 'PPp')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeammateProfileCard;
