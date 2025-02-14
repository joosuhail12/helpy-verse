
import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CannedResponse } from '@/mock/cannedResponses';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { ResponseHoverCard } from './ResponseHoverCard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteResponseDialog } from './DeleteResponseDialog';

interface CategoryGroupProps {
  category: string;
  responses: CannedResponse[];
  view: 'list' | 'grid';
  onResponseClick: (id: string) => void;
  selectedResponses: string[];
  onSelectResponse: (id: string) => void;
}

export const CategoryGroup = ({ 
  category, 
  responses, 
  view, 
  onResponseClick,
  selectedResponses,
  onSelectResponse,
}: CategoryGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [responseToDelete, setResponseToDelete] = useState<CannedResponse | null>(null);

  const getContentPreview = (content: string) => {
    const textContent = content.replace(/<[^>]+>/g, '');
    return `${textContent.slice(0, 100)}${textContent.length > 100 ? '...' : ''}`;
  };

  const isFrequentlyUsed = (response: CannedResponse) => response.shortcut.length <= 3;

  const handleShare = async (responseId: string) => {
    setLoadingAction(responseId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-[#9b87f5]/5 border-b transition-colors duration-300"
      >
        <span className="font-semibold text-lg">{category}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-[#9b87f5] transition-transform duration-300" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#9b87f5] transition-transform duration-300" />
        )}
      </Button>
      
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'}
        `}
      >
        <div className={`p-4 ${view === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
          {responses.map((response, index) => (
            <ResponseHoverCard key={response.id} response={response}>
              <div
                className={`
                  group p-4 rounded-lg border border-gray-200 
                  hover:border-[#9b87f5] transition-all duration-300 cursor-pointer
                  hover:shadow-md hover:bg-[#F2FCE2]/20
                  animate-fade-in
                  ${view === 'grid' ? '' : ''}
                  relative
                  motion-safe:animate-[fadeSlideIn_0.3s_ease-out]
                  motion-safe:animate-delay-[${index * 50}ms]
                `}
                style={{
                  '--tw-animate-delay': `${index * 50}ms`,
                }}
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Checkbox
                          checked={selectedResponses.includes(response.id)}
                          onCheckedChange={() => onSelectResponse(response.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-[#9b87f5] data-[state=checked]:border-[#9b87f5] transition-colors duration-200"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Select response</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div 
                  className="ml-6"
                  onClick={() => onResponseClick(response.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 group-hover:text-[#9b87f5] transition-colors duration-200">
                        {response.title}
                      </h3>
                      <div className="flex gap-2">
                        {isFrequentlyUsed(response) && (
                          <Badge 
                            variant="secondary" 
                            className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 transition-colors duration-200"
                          >
                            <Star className="h-3 w-3 mr-1 fill-[#9b87f5] transition-transform duration-200 group-hover:scale-110" />
                            Frequent
                          </Badge>
                        )}
                        {response.isShared && (
                          <Badge 
                            variant="outline" 
                            className="border-[#9b87f5] text-[#9b87f5] transition-colors duration-200"
                          >
                            {loadingAction === response.id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Share2 className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                            )}
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 transition-opacity duration-200 group-hover:opacity-75">
                      {getContentPreview(response.content).length} chars
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 transition-colors duration-200 group-hover:text-gray-700">
                    {getContentPreview(response.content)}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded transition-colors duration-200 group-hover:bg-gray-200">
                      /{response.shortcut}
                    </span>
                  </div>
                </div>
              </div>
            </ResponseHoverCard>
          ))}
        </div>
      </div>

      <DeleteResponseDialog
        response={responseToDelete}
        open={!!responseToDelete}
        onOpenChange={(open) => !open && setResponseToDelete(null)}
        onDelete={(id) => {
          // Handle delete logic
          setResponseToDelete(null);
        }}
      />
    </div>
  );
};

