
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { History, RotateCcw } from 'lucide-react';
import type { ContentVersion } from '@/types/content';

interface VersionHistoryProps {
  versions: ContentVersion[];
  onRestore: (version: ContentVersion) => void;
}

export const VersionHistory = ({ versions, onRestore }: VersionHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.length === 0 && (
            <p className="text-center text-muted-foreground">No version history available</p>
          )}
          
          {versions
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((version) => (
              <div 
                key={version.id}
                className="border rounded-md p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={version.createdBy.avatar}
                      alt={version.createdBy.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium">{version.createdBy.name}</span>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(version.createdAt))} ago
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">{version.changes}</p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onRestore(version)}
                >
                  <RotateCcw className="h-3 w-3 mr-2" />
                  Restore this version
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
