
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ResponseCard } from './ResponseCard';
import { CannedResponse } from '@/types/cannedResponse';

interface ResponsesGridProps {
  responses: CannedResponse[];
  onSelect: (response: CannedResponse) => void;
  onDelete?: (id: string) => void;
  view?: 'list' | 'grid';
}

export const ResponsesGrid = ({
  responses,
  onSelect,
  onDelete,
  view = 'list'
}: ResponsesGridProps) => {
  return (
    <CardContent className={`
      ${view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        : 'flex flex-col gap-4'
      }
    `}>
      {responses.map((response, index) => (
        <ResponseCard
          key={response.id}
          response={response}
          onSelect={onSelect}
          onDelete={onDelete}
          view={view}
          className="animate-in fade-in-0 slide-in-from-left-1 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </CardContent>
  );
};
