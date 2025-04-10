
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { CannedResponse } from '@/mock/cannedResponses';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RecentlyUsedSectionProps {
  responses: CannedResponse[];
  onResponseClick: (id: string) => void;
}

export const RecentlyUsedSection = ({ responses, onResponseClick }: RecentlyUsedSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const recentResponses = [...responses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (recentResponses.length === 0) return null;

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 mb-4 w-full group">
          <div className="flex items-center gap-2 flex-1">
            <Clock className="h-4 w-4 text-[#9b87f5]" />
            <h2 className="font-semibold">Recently Used</h2>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#9b87f5] transition-transform group-hover:scale-110" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9b87f5] transition-transform group-hover:scale-110" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="animate-accordion-down">
          <div className="grid gap-3">
            {recentResponses.map((response) => (
              <div
                key={response.id}
                onClick={() => onResponseClick(response.id)}
                className="p-3 rounded-lg border border-gray-200 hover:border-[#9b87f5] cursor-pointer transition-all animate-fade-in"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{response.title}</h3>
                  <Badge variant="secondary" className="bg-[#9b87f5]/10 text-[#9b87f5]">
                    /{response.shortcut}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{response.content}</p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
