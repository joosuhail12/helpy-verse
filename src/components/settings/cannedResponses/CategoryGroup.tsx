
import React from 'react';
import { Card } from '@/components/ui/card';
import { CategoryHeader } from './CategoryHeader';
import { ResponsesGrid } from './ResponsesGrid';
import { CannedResponse } from '@/types/cannedResponse';

export interface CategoryGroupProps {
  title: string;
  responses: CannedResponse[];
  onSelect: (response: CannedResponse) => void;
  view?: 'list' | 'grid';
  selectedResponses?: string[];
  onSelectResponse?: (id: string) => void;
  category?: string;
  onResponseClick?: (id: string) => void;
}

export const CategoryGroup = ({
  title,
  responses,
  onSelect,
  onResponseClick,
  view = 'list',
}: CategoryGroupProps) => {
  const handleDelete = (id: string) => {
    onResponseClick?.(id);
  };

  return (
    <Card>
      <CategoryHeader title={title} />
      <ResponsesGrid
        responses={responses}
        onSelect={onSelect}
        onDelete={handleDelete}
        view={view}
      />
    </Card>
  );
};
