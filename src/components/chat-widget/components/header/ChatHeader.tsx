
import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import AgentAvatarGroup from './AgentAvatarGroup';
import { useThemeContext } from '@/context/ThemeContext';

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  agents?: string[];
  onBackClick?: () => void;
  showBackButton?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  agents = [],
  onBackClick,
  showBackButton = false,
  onClose,
  children
}) => {
  const { colors, branding, radius } = useThemeContext();
  
  // Map theme radius to CSS classes
  const getBorderRadiusClass = () => {
    switch (radius) {
      case 'none': return '';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-full';
      default: return 'rounded-md';
    }
  };
  
  return (
    <div 
      className={`p-3 flex items-center border-b`}
      style={{ 
        backgroundColor: colors.headerBackground || colors.background,
        color: colors.headerForeground || colors.foreground,
        borderColor: colors.border
      }}
    >
      {(showBackButton || onBackClick) && (
        <button 
          onClick={onBackClick} 
          className={`p-1 mr-2 hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${getBorderRadiusClass()}`}
          aria-label="Go back"
          style={{ color: colors.headerForeground || colors.foreground }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      
      {branding?.logoUrl && (
        <div className="mr-2 flex-shrink-0">
          <img 
            src={branding.logoUrl} 
            alt="Brand logo" 
            style={{ 
              width: branding.logoWidth || 24, 
              height: branding.logoHeight || 24 
            }}
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate" style={{ color: colors.headerForeground || colors.foreground }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs truncate" style={{ color: colors.mutedForeground }}>
            {subtitle}
          </p>
        )}
      </div>
      
      {agents && agents.length > 0 && (
        <div className="ml-2">
          <AgentAvatarGroup agents={agents} />
        </div>
      )}
      
      {children && (
        <div className="ml-2">
          {children}
        </div>
      )}

      {onClose && (
        <button 
          onClick={onClose} 
          className={`p-1 ml-2 hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${getBorderRadiusClass()}`}
          aria-label="Close chat"
          style={{ color: colors.headerForeground || colors.foreground }}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
