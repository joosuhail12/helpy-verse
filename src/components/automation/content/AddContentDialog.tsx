
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FilePlus, Link, Code } from 'lucide-react';
import { CreateSnippet } from './create/CreateSnippet';
import { FileUpload } from './create/FileUpload';
import { WebScraper } from './create/WebScraper';

export const AddContentDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Content</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="snippet" className="mt-4">
          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="snippet" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Create Snippet
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="scrape" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Scrape Web
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="snippet">
              <CreateSnippet onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="upload">
              <FileUpload onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="scrape">
              <WebScraper onSuccess={() => setOpen(false)} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
