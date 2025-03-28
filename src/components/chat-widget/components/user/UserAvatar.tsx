
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeContext } from '@/context/ThemeContext';

export interface UserAvatarProps {
  name: string;
  color?: string;
  image?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, color, image }) => {
  const { colors } = useThemeContext();
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const defaultColor = color || colors.primary;
  
  return (
    <Avatar className="h-8 w-8">
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback 
        className="text-xs" 
        style={{ 
          backgroundColor: defaultColor,
          color: '#fff',
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
