
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { ContentVersion } from '@/types/content';

interface VersionHistoryProps {
  versions: ContentVersion[];
  onRestore: (version: ContentVersion) => void;
  currentVersionId: string;
}

export const VersionHistory = ({ versions, onRestore, currentVersionId }: VersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No previous versions available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Version History ({versions.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {versions.map((version) => {
            const isCurrent = version.id === currentVersionId;
            const user = version.user || version.createdBy;
            
            return (
              <div
                key={version.id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  isCurrent ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user?.name}
                      {isCurrent && <span className="text-xs ml-2 text-primary">(Current)</span>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {version.changeDescription || version.changes ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedVersion(version);
                        setDialogOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  ) : null}
                  {!isCurrent && (
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
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version Details</DialogTitle>
          </DialogHeader>
          {selectedVersion && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={(selectedVersion.user || selectedVersion.createdBy)?.avatar} 
                    alt={(selectedVersion.user || selectedVersion.createdBy)?.name} 
                  />
                  <AvatarFallback>
                    {(selectedVersion.user || selectedVersion.createdBy)?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {(selectedVersion.user || selectedVersion.createdBy)?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedVersion.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
              
              {(selectedVersion.changeDescription || selectedVersion.changes) && (
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium mb-1">Changes:</div>
                  <div className="text-sm">
                    {selectedVersion.changeDescription || selectedVersion.changes}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                {selectedVersion.id !== currentVersionId && (
                  <Button onClick={() => {
                    onRestore(selectedVersion);
                    setDialogOpen(false);
                  }}>
                    Restore This Version
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
