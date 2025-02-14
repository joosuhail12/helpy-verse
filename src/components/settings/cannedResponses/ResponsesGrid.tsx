
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ResponseCard } from './ResponseCard';
import type { CannedResponse } from '@/mock/cannedResponses';

interface ResponsesGridProps {
  responses: CannedResponse[];
  onSelect: (response: CannedResponse) => void;
  onDelete?: (id: string) => void;
}

export const ResponsesGrid = ({ 
  responses, 
  onSelect,
  onDelete 
}: ResponsesGridProps) => {
  return (
    <CardContent className="grid gap-4">
      {responses.map((response, index) => (
        <ResponseCard
          key={response.id}
          response={response}
          onSelect={onSelect}
          onDelete={onDelete}
          className="animate-in fade-in-0 slide-in-from-left-1 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </CardContent>
  );
};
