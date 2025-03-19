
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentVersion, Content, User } from '@/types/content';
import { SnippetPreview } from './preview/SnippetPreview';
import { FilePreview } from './preview/FilePreview';
import { WebsitePreview } from './preview/WebsitePreview';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface ContentPreviewProps {
  content: Content;
  onRestore: (version: ContentVersion) => void;
  currentUser: User;
}

export const ContentPreview = ({ content, onRestore, currentUser }: ContentPreviewProps) => {
  const [activeVersion, setActiveVersion] = useState<ContentVersion | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const handlePreviewVersion = (version: ContentVersion) => {
    setActiveVersion(version);
  };

  const handleRestoreVersion = () => {
    if (!activeVersion) return;
    
    // Create a new version based on the restored version
    const newVersion: ContentVersion = {
      id: Date.now().toString(),
      content: activeVersion.content,
      createdAt: new Date().toISOString(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || '',
        email: currentUser.email
      },
      changeDescription: `Restored from version created at ${format(new Date(activeVersion.createdAt), 'PPpp')}`,
    };
    
    onRestore(newVersion);
    setRestoreDialogOpen(false);
    setActiveVersion(null);
    
    toast({
      title: 'Version Restored',
      description: 'The selected version has been restored',
    });
  };

  const getPreviewComponent = () => {
    // If viewing a specific version, use that content
    const contentToPreview = activeVersion ? activeVersion.content : content.content;
    const contentType = content.type || '';

    switch (contentType) {
      case 'snippet':
        return <SnippetPreview content={contentToPreview || ''} />;
      case 'file':
        return <FilePreview file={contentToPreview || ''} />;
      case 'website':
        return <WebsitePreview website={contentToPreview || ''} />;
      default:
        return <SnippetPreview content={contentToPreview || ''} />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview</CardTitle>
          {activeVersion && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveVersion(null)}
              >
                Back to Current
              </Button>
              <Button
                size="sm"
                onClick={() => setRestoreDialogOpen(true)}
              >
                Restore This Version
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {content.versions && content.versions.length > 0 && (
            <Tabs defaultValue="current" className="mb-6">
              <TabsList className="mb-2">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="versions">Versions ({content.versions.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="current">
                {activeVersion ? (
                  <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md mb-4 text-sm">
                    You are previewing a previous version. This is not the current version.
                    <Button
                      variant="link"
                      size="sm"
                      className="ml-2 p-0 h-auto"
                      onClick={() => setActiveVersion(null)}
                    >
                      Back to current
                    </Button>
                  </div>
                ) : null}
                {getPreviewComponent()}
              </TabsContent>
              <TabsContent value="versions">
                <div className="grid gap-2">
                  {content.versions.map((version) => (
                    <Button
                      key={version.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handlePreviewVersion(version)}
                    >
                      {version.changeDescription || 'Version'} - {format(new Date(version.createdAt), 'PPp')}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {!activeVersion && getPreviewComponent()}
        </CardContent>
      </Card>

      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to restore this version? This will create a new version based on the selected one.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestoreVersion}>
              Restore
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
