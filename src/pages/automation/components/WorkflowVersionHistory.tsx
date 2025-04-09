
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { History, RotateCcw, ChevronDown, ChevronUp, ClipboardEdit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { WorkflowVersion, WorkflowChange } from '@/types/workflow';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface WorkflowVersionHistoryProps {
  versions: WorkflowVersion[];
  onRestoreVersion?: (versionId: string) => void;
  className?: string;
}

export const WorkflowVersionHistory: React.FC<WorkflowVersionHistoryProps> = ({
  versions,
  onRestoreVersion,
  className,
}) => {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);
  
  const getChangeTypeColor = (type: WorkflowChange['type']) => {
    switch (type) {
      case 'add': return 'text-green-600';
      case 'remove': return 'text-red-600';
      case 'update': return 'text-blue-600';
      default: return '';
    }
  };

  const getChangeTypeSymbol = (type: WorkflowChange['type']) => {
    switch (type) {
      case 'add': return '+';
      case 'remove': return '-';
      case 'update': return '↻';
      default: return '';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <History className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <p className="text-sm text-muted-foreground">No version history available</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sortedVersions.map((version, index) => (
                <Collapsible key={version.id} className="border rounded-md">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="h-6 min-w-[3rem] flex items-center justify-center">
                          v{version.version}
                        </Badge>
                        <div>
                          <div className="text-sm font-medium">
                            {index === 0 ? "Current Version" : `Version ${version.version}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })} by {version.createdBy.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {index !== 0 && onRestoreVersion && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestoreVersion(version.id);
                            }}
                            className="h-7"
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Restore
                          </Button>
                        )}
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform collapsible-icon" />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Separator />
                    <div className="p-3 text-sm">
                      {version.changes.length === 0 ? (
                        <p className="text-muted-foreground text-center py-2">No changes recorded</p>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="font-medium text-xs uppercase text-muted-foreground mb-1">Changes</h4>
                          <ul className="space-y-1.5 text-xs">
                            {version.changes.map((change, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className={cn("font-mono", getChangeTypeColor(change.type))}>
                                  {getChangeTypeSymbol(change.type)}
                                </span>
                                <div>
                                  <span className="font-medium">{change.field}</span>
                                  {change.type === 'update' && (
                                    <span className="ml-1">
                                      <span className="text-muted-foreground text-xs">from</span>{" "}
                                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{String(change.oldValue || '')}</code>
                                      {" "}
                                      <span className="text-muted-foreground text-xs">to</span>
                                      {" "}
                                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{String(change.newValue || '')}</code>
                                    </span>
                                  )}
                                  {change.type === 'add' && (
                                    <span className="ml-1">
                                      <span className="text-muted-foreground text-xs">added with value</span>{" "}
                                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{String(change.newValue || '')}</code>
                                    </span>
                                  )}
                                  {change.type === 'remove' && (
                                    <span className="ml-1">
                                      <span className="text-muted-foreground text-xs">removed (was </span>
                                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{String(change.oldValue || '')}</code>
                                      <span className="text-muted-foreground text-xs">)</span>
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
