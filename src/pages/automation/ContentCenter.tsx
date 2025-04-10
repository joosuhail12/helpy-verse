
import { useEffect } from 'react';
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
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { SearchBar } from '@/components/automation/content/search/SearchBar';
import { fetchContentStats } from '@/store/slices/automation/contentCenterSlice';

const ContentCenter = () => {
  const dispatch = useAppDispatch();
  const contentState = useAppSelector((state) => state.content);
  const selectedIds = contentState?.selectedIds || [];
  const searchQuery = contentState?.search?.query || '';
  
  useEffect(() => {
    // Fetch content stats when component mounts
    dispatch(fetchContentStats());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <ContentHeader />
        
        <div className="grid gap-8">
          {/* Analytics Section */}
          <section>
            <div className="grid gap-6">
              <Card className="p-6">
                <ContentSummary />
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <ProcessingMetrics />
                </Card>
                
                <Card className="lg:col-span-2 p-6">
                  <ContentTrendsChart />
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CategoryDistribution />
                </Card>
                
                <Card className="p-6">
                  <MessageVolumeTrends />
                </Card>
              </div>
            </div>
          </section>

          {/* Content Management Section */}
          <section className="space-y-6">
            <EmbeddingStatusBar />
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="w-full md:w-2/3">
                <SearchBar />
              </div>
              <div className="flex justify-end">
                <ContentSorting />
              </div>
            </div>

            <ContentFilters />

            <Card className="overflow-hidden border-0 shadow-md">
              <ContentList searchQuery={searchQuery} />
            </Card>
          </section>
        </div>
      </div>

      <ContentBatchActions selectedIds={selectedIds} />
    </div>
  );
};

export default ContentCenter;
