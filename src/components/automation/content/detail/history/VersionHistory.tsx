
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ContentVersion } from '@/types/content';

interface VersionHistoryProps {
  versions: ContentVersion[];
  onRestore: (version: ContentVersion) => void;
}

export const VersionHistory = ({ versions, onRestore }: VersionHistoryProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Version History</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {versions.map((version) => (
            <div key={version.id} className="flex items-start gap-4 p-3 hover:bg-accent rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(version.createdAt))} ago
                  </span>
                </div>
                <p className="text-sm mt-1">{version.changes}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">By</span>
                  <span className="text-sm font-medium">{version.createdBy.name}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onRestore(version)}>
                Restore
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
