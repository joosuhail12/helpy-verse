
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponseHoverCard } from './ResponseHoverCard';
import type { CannedResponse } from '@/mock/cannedResponses';

interface CategoryGroupProps {
  title: string;
  responses: CannedResponse[];
  onSelect: (response: CannedResponse) => void;
}

export const CategoryGroup = ({ title, responses, onSelect }: CategoryGroupProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {responses.map((response, index) => (
          <ResponseHoverCard
            key={response.id}
            response={response}
            onSelect={() => onSelect(response)}
            className={`animate-in fade-in-0 slide-in-from-left-1 duration-300`}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </CardContent>
    </Card>
  );
};
