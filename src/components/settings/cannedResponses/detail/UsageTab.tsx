
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const UsageTab = () => {
  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>
            How often this canned response is used
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This would have real statistics in a production app */}
          <div className="py-8 text-center text-muted-foreground">
            Usage statistics are not available in this demo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
