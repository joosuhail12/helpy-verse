
import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CannedResponse } from '@/mock/cannedResponses';
import { Badge } from '@/components/ui/badge';

interface CategoryGroupProps {
  category: string;
  responses: CannedResponse[];
  view: 'list' | 'grid';
  onResponseClick: (id: string) => void;
}

export const CategoryGroup = ({ category, responses, view, onResponseClick }: CategoryGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getContentPreview = (content: string) => {
    const textContent = content.replace(/<[^>]+>/g, '');
    return `${textContent.slice(0, 100)}${textContent.length > 100 ? '...' : ''}`;
  };

  // For demo purposes, mark responses as frequently used if they have a short shortcut
  const isFrequentlyUsed = (response: CannedResponse) => response.shortcut.length <= 3;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-[#9b87f5]/5 border-b"
      >
        <span className="font-semibold text-lg">{category}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-[#9b87f5]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#9b87f5]" />
        )}
      </Button>
      
      {isExpanded && (
        <div className={`p-4 ${view === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
          {responses.map((response) => (
            <div
              key={response.id}
              className={`
                group p-4 rounded-lg border border-gray-200 
                hover:border-[#9b87f5] transition-all cursor-pointer
                hover:shadow-md hover:bg-[#F2FCE2]/20
                ${view === 'grid' ? '' : ''}
              `}
              onClick={() => onResponseClick(response.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-[#9b87f5] transition-colors">
                    {response.title}
                  </h3>
                  <div className="flex gap-2">
                    {isFrequentlyUsed(response) && (
                      <Badge variant="secondary" className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20">
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
                <span className="text-xs text-gray-500">
                  {getContentPreview(response.content).length} chars
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {getContentPreview(response.content)}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">/{response.shortcut}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

