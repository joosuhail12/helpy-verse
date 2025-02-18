
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ContentDetailHeader } from '@/components/automation/content/detail/ContentDetailHeader';
import { ContentForm } from '@/components/automation/content/detail/ContentForm';
import { ContentReindexCard } from '@/components/automation/content/detail/ContentReindexCard';
import { ContentPreview } from '@/components/automation/content/detail/ContentPreview';
import { useAppSelector } from '@/hooks/useAppSelector';

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const content = useAppSelector((state) => 
    state.content.items.find(item => item.id === id)
  );

  if (!content) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Content not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <ContentDetailHeader content={content} />
        
        <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
          <div className="space-y-8">
            <ContentForm content={content} />
          </div>
          
          <div className="space-y-8">
            <ContentPreview content={content} />
            <ContentReindexCard content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
