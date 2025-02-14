
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { CannedResponse } from '@/mock/cannedResponses';
import { Badge } from '@/components/ui/badge';
import { Star, Share2 } from 'lucide-react';

interface ResponseHoverCardProps {
  response: CannedResponse;
  children: React.ReactNode;
}

export const ResponseHoverCard = ({ response, children }: ResponseHoverCardProps) => {
  const isFrequentlyUsed = response.shortcut.length <= 3;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
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
          <div className="pt-2 text-xs text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">/{response.shortcut}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
