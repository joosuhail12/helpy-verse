
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from '@/components/ui/badge';
import { Star, Share2 } from 'lucide-react';
import type { CannedResponse } from '@/mock/cannedResponses';

export interface ResponseHoverCardProps {
  response: CannedResponse;
  onSelect?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ResponseHoverCard = ({ response, onSelect, className, style }: ResponseHoverCardProps) => {
  const isFrequentlyUsed = response.usageStats?.totalUses > 100;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          onClick={onSelect} 
          className={`p-4 rounded-lg border border-gray-200 hover:border-[#9b87f5] cursor-pointer transition-all duration-200 hover:shadow-md ${className}`}
          style={style}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{response.title}</h4>
            <div className="flex gap-1">
              {isFrequentlyUsed && (
                <Badge variant="secondary" className="bg-[#9b87f5]/10 text-[#9b87f5]">
                  <Star className="h-3 w-3 mr-1 fill-[#9b87f5]" />
                  Frequent
                </Badge>
              )}
              {response.isShared && (
                <Badge variant="outline" className="border-[#9b87f5] text-[#9b87f5]">
                  <Share2 className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{response.content}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">/{response.shortcut}</span>
            {response.usageStats && (
              <span className="text-xs text-gray-500">
                Used {response.usageStats.totalUses} times
              </span>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{response.title}</h4>
            <div className="flex gap-1">
              {isFrequentlyUsed && (
                <Badge variant="secondary" className="bg-[#9b87f5]/10 text-[#9b87f5]">
                  <Star className="h-3 w-3 mr-1 fill-[#9b87f5]" />
                  Frequent
                </Badge>
              )}
              {response.isShared && (
                <Badge variant="outline" className="border-[#9b87f5] text-[#9b87f5]">
                  <Share2 className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600">{response.content}</p>
          <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">/{response.shortcut}</span>
            <span>Created by {response.createdBy}</span>
          </div>
          {response.usageStats && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>Used {response.usageStats.totalUses} times</p>
              <p>Last used: {new Date(response.usageStats.lastUsed).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
