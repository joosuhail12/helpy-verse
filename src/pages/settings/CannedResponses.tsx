
import { useState, useEffect } from 'react';
import { mockCannedResponses, type CannedResponse } from '@/mock/cannedResponses';
import { Button } from '@/components/ui/button';
import { PlusCircle, Keyboard, Share2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ViewToggle } from '@/components/settings/cannedResponses/ViewToggle';
import { CategoryGroup } from '@/components/settings/cannedResponses/CategoryGroup';
import { RecentlyUsedSection } from '@/components/settings/cannedResponses/RecentlyUsedSection';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const CannedResponses = () => {
  const [responses] = useState<CannedResponse[]>(mockCannedResponses);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const { toast } = useToast();

  // Group responses by category
  const groupedResponses = responses.reduce((acc, response) => {
    const category = response.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(response);
    return acc;
  }, {} as Record<string, CannedResponse[]>);

  const handleResponseClick = (id: string) => {
    window.location.href = `/home/settings/canned-responses/${id}`;
  };

  const handleSelectResponse = (id: string) => {
    setSelectedResponses(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    toast({
      title: "Responses deleted",
      description: `${selectedResponses.length} responses have been deleted.`,
    });
    setSelectedResponses([]);
  };

  const handleBulkShare = () => {
    toast({
      title: "Responses shared",
      description: `${selectedResponses.length} responses have been shared with the team.`,
    });
    setSelectedResponses([]);
  };

  const handleResponseSelect = (response: CannedResponse) => {
    handleResponseClick(response.id);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.location.href = '/home/settings/canned-responses/create';
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2FCE2]/30">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-[#9b87f5] bg-clip-text text-transparent">
              Canned Responses
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-muted-foreground">
                Create and manage your team's canned responses for quick replies
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2">
                      <Keyboard className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Keyboard Shortcuts</p>
                      <div className="space-y-1">
                        <p>Create new response: Ctrl/⌘ + N</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {selectedResponses.length > 0 && (
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkShare}
                        className="text-[#9b87f5]"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share selected responses</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete selected responses</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-muted-foreground">
                  {selectedResponses.length} selected
                </span>
              </div>
            )}
            <ViewToggle view={view} onViewChange={setView} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/home/settings/canned-responses/create">
                    <Button className="bg-[#9b87f5] hover:bg-[#9b87f5]/90">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Response
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Create new response (Ctrl/⌘ + N)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <RecentlyUsedSection 
          responses={responses} 
          onResponseClick={handleResponseClick} 
        />

        <div className="space-y-6">
          {Object.entries(groupedResponses).map(([category, categoryResponses]) => (
            <CategoryGroup
              key={category}
              title={category}
              responses={categoryResponses}
              view={view}
              onResponseClick={handleResponseClick}
              selectedResponses={selectedResponses}
              onSelectResponse={handleSelectResponse}
              onSelect={handleResponseSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CannedResponses;

