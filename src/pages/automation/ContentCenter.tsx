
import { Card } from '@/components/ui/card';
import { ContentList } from '@/components/automation/content/ContentList';
import { ContentHeader } from '@/components/automation/content/ContentHeader';
import { EmbeddingStatusBar } from '@/components/automation/content/EmbeddingStatusBar';
import { ContentFilters } from '@/components/automation/content/ContentFilters';
import { ContentSorting } from '@/components/automation/content/ContentSorting';
import { ContentSummary } from '@/components/automation/content/analytics/ContentSummary';
import { ContentTrendsChart } from '@/components/automation/content/analytics/ContentTrendsChart';
import { MessageVolumeTrends } from '@/components/automation/content/analytics/MessageVolumeTrends';
import { ProcessingMetrics } from '@/components/automation/content/analytics/ProcessingMetrics';
import { CategoryDistribution } from '@/components/automation/content/analytics/CategoryDistribution';
import { ContentBatchActions } from '@/components/automation/content/ContentBatchActions';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SearchBar } from '@/components/automation/content/search/SearchBar';

const ContentCenter = () => {
  const selectedIds = useAppSelector((state) => state.content.selectedIds);
  const searchQuery = useAppSelector((state) => state.content.search.query);

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px] space-y-6">
      <ContentHeader />
      
      <ContentSummary />
      
      <ProcessingMetrics />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentTrendsChart />
        <CategoryDistribution />
      </div>
      
      <MessageVolumeTrends />
      
      <EmbeddingStatusBar />
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <SearchBar />
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
