
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Settings, CheckCircle, MessageCircle, AlertCircle, PauseCircle, XCircle, Power, LucideIcon } from 'lucide-react';
import { UserStatus, statusConfig } from '@/types/userStatus';
import type { RootState } from '@/store/store';

interface UserProfileCardProps {
  isCollapsed: boolean;
}

interface StatusIconsMap {
  [key: string]: LucideIcon;
}

const UserProfileCard = ({ isCollapsed }: UserProfileCardProps) => {
  const navigate = useNavigate();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState<UserStatus>('available');

  // Extract user email and role safely
  const userEmail = auth?.user?.data?.id || 'user@example.com'; // Fallback to a default
  const userRole = 'user'; // Default role since it's not in the current auth state

  const statusIcons: StatusIconsMap = {
    'available': CheckCircle,
    'active-conversation': MessageCircle,
    'busy': AlertCircle,
    'break': PauseCircle,
    'inactive': XCircle,
    'offline': Power
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className={`p-4 border-t border-purple-100/50 ${isCollapsed ? 'text-center' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        {!isCollapsed && (
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
            <AvatarFallback>
              {userEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex-1 ${isCollapsed ? 'hidden' : ''}`}>
          <div className="font-medium text-sm">{userEmail}</div>
          <div className="text-xs text-muted-foreground">{userRole}</div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/5"
                onClick={() => navigate('/home/settings/profile')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 rounded-lg hover:bg-primary/5 ${
                    isCollapsed ? 'px-2' : 'px-3'
                  }`}
                >
                  <StatusIcon className={`h-4 w-4 ${statusConfig[status].color.replace('bg-', 'text-')}`} />
                  {!isCollapsed && (
                    <span className="text-sm">{statusConfig[status].label}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Change Status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          align="start"
          className="w-56"
        >
          {Object.entries(statusConfig).map(([key, { label, color }]) => {
            const Icon = statusIcons[key as UserStatus];
            return (
              <DropdownMenuItem
                key={key}
                className="gap-2"
                onClick={() => setStatus(key as UserStatus)}
              >
                <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
                {label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileCard;
