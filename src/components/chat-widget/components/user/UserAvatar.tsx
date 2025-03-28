
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserStatus, statusConfig } from '@/types/userStatus';

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  status?: UserStatus;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  avatarUrl, 
  status = 'offline',
  size = 'md'
}) => {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Determine avatar size
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  // Get status indicator color
  const statusColor = status ? statusConfig[status]?.color : 'bg-slate-500';
  
  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      {/* Status indicator */}
      {status && (
        <span 
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${statusColor}`}
          title={statusConfig[status]?.label || 'Offline'}
        />
      )}
    </div>
  );
};

export default UserAvatar;
