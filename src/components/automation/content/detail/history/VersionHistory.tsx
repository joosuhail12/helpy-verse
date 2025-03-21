
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ContentVersion } from '@/types/content';

interface VersionHistoryProps {
  versions: ContentVersion[];
  onRestore: (version: ContentVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, onRestore }) => {
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Version History</h3>
      <div className="space-y-4">
        {sortedVersions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No version history available</p>
        ) : (
          sortedVersions.map((version, index) => (
            <div
              key={version.id}
              className="p-4 border rounded-lg space-y-2 bg-muted/20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">
                    {index === 0 ? "Current Version" : `Version ${sortedVersions.length - index}`}
                  </span>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{formatDistanceToNow(new Date(version.createdAt))} ago</span>
                    <span>•</span>
                    <span>by {version.createdBy.name}</span>
                  </div>
                </div>
                {index !== 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(version)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                )}
              </div>
              {version.changes && (
                <div className="text-sm">
                  <span className="font-medium">Changes: </span>
                  <span>{version.changes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
