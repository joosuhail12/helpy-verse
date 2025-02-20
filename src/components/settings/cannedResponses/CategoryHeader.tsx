
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryHeaderProps {
  title: string;
}

export const CategoryHeader = ({ title }: CategoryHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{title.charAt(0).toUpperCase() + title.slice(1)}</CardTitle>
    </CardHeader>
  );
};
