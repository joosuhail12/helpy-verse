
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Content } from '@/types/content';

interface ContentDetailHeaderProps {
  content: Content;
}

export const ContentDetailHeader = ({ content }: ContentDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/automation/content')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{content.title}</h1>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>
      </div>
    </div>
  );
};
