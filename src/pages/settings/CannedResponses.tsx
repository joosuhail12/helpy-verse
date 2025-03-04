import { useState, useEffect } from 'react';
import { CannedResponse } from '@/types/cannedResponse';
import { useToast } from "@/hooks/use-toast";
import { CannedResponsesHeader } from '@/components/settings/cannedResponses/CannedResponsesHeader';
import { CannedResponsesSearch } from '@/components/settings/cannedResponses/CannedResponsesSearch';
import { CannedResponsesBulkActions } from '@/components/settings/cannedResponses/CannedResponsesBulkActions';
import { CategoryGroup } from '@/components/settings/cannedResponses/CategoryGroup';
import { RecentlyUsedSection } from '@/components/settings/cannedResponses/RecentlyUsedSection';
import { ViewToggle } from '@/components/settings/cannedResponses/ViewToggle';
import { cannedResponseService } from '@/api/services/cannedResponse.service';
import { Loader2 } from 'lucide-react';

const CannedResponses = () => {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filter responses based on search query
  const filteredResponses = responses.filter(response =>
    response.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group responses by category
  const groupedResponses = filteredResponses.reduce((acc, response) => {
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
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const getCannedResponses = async () => {
      try {
        const cannedResponses = await cannedResponseService.getCannedResponses();

        if (cannedResponses.status === 'success') {
          setResponses(cannedResponses.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch canned responses",
            variant: "destructive",
          });
        }

        setLoading(false);

      } catch (error) {
        setLoading(false);
        console.error('Error fetching canned responses:', error);
        toast({
          title: "Error",
          description: "Failed to fetch canned responses",
          variant: "destructive",
        });
      }
    };

    getCannedResponses();


    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2FCE2]/30">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm">
          <CannedResponsesHeader />
          <div className="flex items-center gap-4">
            {selectedResponses.length > 0 && (
              <CannedResponsesBulkActions
                selectedResponses={selectedResponses}
                view={view}
                onViewChange={setView}
                onBulkShare={handleBulkShare}
                onBulkDelete={handleBulkDelete}
              />
            )}
            {selectedResponses.length === 0 && (
              <ViewToggle view={view} onViewChange={setView} />
            )}
          </div>
          <CannedResponsesSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* <RecentlyUsedSection 
          responses={responses}
          onResponseClick={handleResponseClick}
        />
              // TODO: Implement RecentlyUsedSection component
        */}

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
          {
            loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )
          }
          {!loading && Object.keys(groupedResponses).length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-muted-foreground">
                No responses found matching your search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CannedResponses;
