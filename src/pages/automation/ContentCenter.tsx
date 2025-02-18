
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { ContentList } from '@/components/automation/content/ContentList';
import { ContentHeader } from '@/components/automation/content/ContentHeader';
import { EmbeddingStatusBar } from '@/components/automation/content/EmbeddingStatusBar';
import { ContentFilters } from '@/components/automation/content/ContentFilters';
import { ContentSorting } from '@/components/automation/content/ContentSorting';
import { ContentSummary } from '@/components/automation/content/analytics/ContentSummary';
import { ContentTrendsChart } from '@/components/automation/content/analytics/ContentTrendsChart';
import { MessageVolumeTrends } from '@/components/automation/content/analytics/MessageVolumeTrends';
import { ContentBatchActions } from '@/components/automation/content/ContentBatchActions';
import { useAppSelector } from '@/hooks/useAppSelector';

const ContentCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const selectedIds = useAppSelector((state) => state.content.selectedIds);

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px] space-y-6">
      <ContentHeader />
      
      <ContentSummary />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentTrendsChart />
        <MessageVolumeTrends />
      </div>
      
      <EmbeddingStatusBar />
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
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
          <ContentSorting />
        </div>

        <ContentFilters />
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
        <ContentList searchQuery={searchQuery} />
      </div>

      <ContentBatchActions selectedIds={selectedIds} />
    </div>
  );
};

export default ContentCenter;

