
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Bot } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ContentList } from '@/components/automation/content/ContentList';
import { ContentHeader } from '@/components/automation/content/ContentHeader';

const ContentCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px] space-y-6">
      <ContentHeader />
      
      <div className="flex justify-between gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => toast({ title: "Coming soon", description: "This feature will be implemented in the next phase" })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      <ContentList searchQuery={searchQuery} />
    </div>
  );
};

export default ContentCenter;
