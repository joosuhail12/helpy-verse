
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
      <DialogContent className="max-w-3xl p-6 bg-white dark:bg-gray-950 shadow-lg rounded-lg border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Content</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="snippet" className="mt-4">
          <TabsList className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg">
            <TabsTrigger 
              value="snippet" 
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
            >
              <Code className="h-4 w-4" />
              Create Snippet
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
            >
              <FilePlus className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger 
              value="scrape" 
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
            >
              <Link className="h-4 w-4" />
              Scrape Web
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
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
