
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Content } from '@/types/content';
import { LastEditedBy } from './LastEditedBy';

interface ContentDetailHeaderProps {
  content: Content;
}

export const ContentDetailHeader = ({ content }: ContentDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate('/home/automation/ai/content-center')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{content.title}</h1>
        <p className="text-muted-foreground mt-1">{content.description}</p>
        {content.lastEditedBy && (
          <div className="mt-4">
            <LastEditedBy editor={content.lastEditedBy} lastUpdated={content.lastUpdated} />
          </div>
        )}
      </div>
    </div>
  );
};
