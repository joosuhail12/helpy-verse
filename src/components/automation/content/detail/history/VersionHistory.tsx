
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import type { ContentVersion } from '@/types/content';

interface VersionHistoryProps {
  versions: ContentVersion[];
  onRestore: (version: ContentVersion) => void;
}

export const VersionHistory = ({ versions, onRestore }: VersionHistoryProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Version History</h3>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="p-3 border rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">
                    Version {versions.length - index}
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(version.createdAt))} ago by {version.createdBy.name}
                  </p>
                  {version.changes && (
                    <p className="text-sm mt-1">Changes: {version.changes}</p>
                  )}
                </div>
                {index > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(version)}
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
