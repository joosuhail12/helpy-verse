
import { useState, useEffect } from 'react';
import { mockCannedResponses, type CannedResponse } from '@/mock/cannedResponses';
import { useToast } from "@/hooks/use-toast";
import { CannedResponsesHeader } from '@/components/settings/cannedResponses/CannedResponsesHeader';
import { CannedResponsesSearch } from '@/components/settings/cannedResponses/CannedResponsesSearch';
import { CannedResponsesBulkActions } from '@/components/settings/cannedResponses/CannedResponsesBulkActions';
import { CategoryGroup } from '@/components/settings/cannedResponses/CategoryGroup';
import { RecentlyUsedSection } from '@/components/settings/cannedResponses/RecentlyUsedSection';

const CannedResponses = () => {
  const [responses] = useState<CannedResponse[]>(mockCannedResponses);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter responses based on search query
  const filteredResponses = responses.filter(response => 
    response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          {Object.keys(groupedResponses).length === 0 && (
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
