
import React from 'react';
import { ArrowLeft, X, Shield, Lock } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import AgentAvatarGroup from './AgentAvatarGroup';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  onCloseClick?: () => void;
  showClose?: boolean;
  agentIds?: string[];
  secure?: boolean;
  encrypted?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  onBackClick,
  onCloseClick,
  showClose = false,
  agentIds,
  secure = false,
  encrypted = false,
}) => {
  const { colors } = useThemeContext();

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ background: colors.headerBackground || colors.primary, color: colors.headerForeground || colors.primaryForeground, borderColor: colors.border }}
    >
      <div className="flex items-center">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="mr-2 rounded-full p-1 hover:bg-black/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        
        <div>
          <div className="flex items-center">
            <h2 className="font-medium truncate max-w-[200px]">{title}</h2>
            
            {secure && (
              <Shield className="h-4 w-4 ml-2 text-green-400" title="Secure authenticated session" />
            )}
            
            {encrypted && (
              <Lock className="h-4 w-4 ml-2 text-green-400" title="End-to-end encrypted" />
            )}
          </div>
          
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {agentIds && agentIds.length > 0 && <AgentAvatarGroup agentIds={agentIds} />}
        
        {showClose && onCloseClick && (
          <button
            onClick={onCloseClick}
            className="rounded-full p-1 hover:bg-black/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
