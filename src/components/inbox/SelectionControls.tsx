
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

export const SelectionControls = () => {
  return (
    <Button variant="outline" size="sm" className="flex items-center">
      <CheckSquare className="h-4 w-4 mr-2" />
      <span>Select</span>
    </Button>
  );
};
