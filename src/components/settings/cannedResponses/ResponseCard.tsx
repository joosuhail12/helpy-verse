
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Share2, Edit, Trash2 } from 'lucide-react';
import { CannedResponse } from '@/types/cannedResponse';
import { Link } from 'react-router-dom';

interface ResponseCardProps {
  response: CannedResponse;
  onSelect: (response: CannedResponse) => void;
  onDelete?: (id: string) => void;
  view?: 'list' | 'grid';
  className?: string;
  style?: React.CSSProperties;
}

export const ResponseCard = ({
  response,
  onSelect,
  onDelete,
  view = 'list',
  className = '',
  style
}: ResponseCardProps) => {
  const isFrequentlyUsed = response.numberOfTimesUsed > 100;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(response.id);
    }
  };

  return (
    <Link
      to={`/home/settings/canned-responses/${response.id}`}
      className={`block ${className}`}
      style={style}
    >
      <div
        className={`
          p-4 rounded-lg border border-gray-200 hover:border-[#9b87f5] cursor-pointer 
          transition-all duration-200 hover:shadow-md
          ${view === 'list' ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4' : 'flex flex-col'}
        `}
      >
        <div className={`flex-1 ${view === 'list' ? 'space-y-1' : 'space-y-2'}`}>
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{response.name}</h4>
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
          <p className={`text-sm text-gray-600 ${view === 'list' ? 'line-clamp-1' : 'line-clamp-2'}`}>
            {response.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">/{response.shortcut}</span>
            {response?.numberOfTimesUsed >= 0 && (
              <span className="text-xs text-gray-500">
                Used {response.numberOfTimesUsed} times
              </span>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-2 ${view === 'list' ? 'justify-end' : 'justify-end mt-4'}`}>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-[#9b87f5]/10 hover:text-[#9b87f5]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(response);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-red-100 hover:text-red-600"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};
