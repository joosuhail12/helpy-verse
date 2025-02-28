
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading contacts...</p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
