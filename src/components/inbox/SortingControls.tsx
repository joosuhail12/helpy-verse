
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const SortingControls = () => {
  return (
    <Button variant="outline" size="sm" className="flex items-center">
      <ArrowUpDown className="h-4 w-4 mr-2" />
      <span>Sort</span>
    </Button>
  );
};
