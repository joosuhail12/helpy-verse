
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Clock, Upload, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Teammate } from '@/types/teammate';
import { useRef, useState } from 'react';

interface TeammateProfileCardProps {
  teammate: Teammate;
  isEditing: boolean;
  onUpdateTeammate: (updates: Partial<Teammate>) => void;
  validationErrors: Record<string, string>;
  isLoading: boolean;
}

const TeammateProfileCard = ({
  teammate,
  isEditing,
  onUpdateTeammate,
  validationErrors,
  isLoading,
}: TeammateProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here you would integrate with your custom backend for image upload
      // const response = await uploadImage(file);
      // const imageUrl = response.url;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated upload
      const imageUrl = URL.createObjectURL(file); // Temporary preview
      
      onUpdateTeammate({ avatar: imageUrl });
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teammate.avatar} />
            <AvatarFallback>{teammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isLoading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
        <div className="flex-grow">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <div>
                <Input
                  id="name"
                  value={teammate.name}
                  onChange={(e) => onUpdateTeammate({ name: e.target.value })}
                  disabled={isLoading}
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
                )}
              </div>
            ) : (
              <CardTitle className="text-2xl">{teammate.name}</CardTitle>
            )}
          </div>
          <CardDescription className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {isEditing ? (
              <div className="flex-grow">
                <Input
                  value={teammate.email}
                  onChange={(e) => onUpdateTeammate({ email: e.target.value })}
                  disabled={isLoading}
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>
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
                disabled={isLoading}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WORKSPACE_ADMIN">Workspace Admin</SelectItem>
                  <SelectItem value="WORKSPACE_AGENT">Agent</SelectItem>
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
