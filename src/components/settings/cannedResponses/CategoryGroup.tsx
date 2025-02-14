
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CannedResponse } from '@/mock/cannedResponses';

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

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-4 hover:bg-gray-100"
      >
        <span className="font-semibold">{category}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      {isExpanded && (
        <div className={view === 'grid' ? 'grid grid-cols-2 gap-4 mt-4' : 'space-y-4 mt-4'}>
          {responses.map((response) => (
            <div
              key={response.id}
              className={`p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition-all cursor-pointer
                ${view === 'grid' ? 'bg-white shadow-sm hover:shadow' : 'bg-white shadow-sm hover:shadow'}`}
              onClick={() => onResponseClick(response.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{response.title}</h3>
                <span className="text-xs text-gray-500">
                  {getContentPreview(response.content).length} chars
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{getContentPreview(response.content)}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>/{response.shortcut}</span>
                <span>{response.isShared ? 'Shared' : 'Private'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
