
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilePlus, Link, Code } from 'lucide-react';
import { CreateSnippet } from '@/components/automation/content/create/CreateSnippet';
import { FileUpload } from '@/components/automation/content/create/FileUpload';
import { WebScraper } from '@/components/automation/content/create/WebScraper';

const CreateContent = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/home/automation/ai/content-center');
  };

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Create Content</h1>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
        <Tabs defaultValue="snippet" className="w-full">
          <TabsList className="p-1 m-4 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
          <div className="p-4">
            <TabsContent value="snippet">
              <CreateSnippet onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="upload">
              <FileUpload onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="scrape">
              <WebScraper onSuccess={handleSuccess} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateContent;
