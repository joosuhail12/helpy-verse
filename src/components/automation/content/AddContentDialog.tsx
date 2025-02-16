
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
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 bg-white dark:bg-gray-950 shadow-lg rounded-lg border-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Add Content</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="snippet" className="flex flex-col h-full">
          <TabsList className="mx-6 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg">
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
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <TabsContent value="snippet" className="mt-6 h-full data-[state=active]:flex flex-col">
              <CreateSnippet onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="upload" className="mt-6 h-full data-[state=active]:flex flex-col">
              <FileUpload onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="scrape" className="mt-6 h-full data-[state=active]:flex flex-col">
              <WebScraper onSuccess={() => setOpen(false)} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

