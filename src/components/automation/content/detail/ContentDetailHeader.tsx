
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Code, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Content } from '@/types/content';

interface ContentDetailHeaderProps {
  content: Content;
}

export const ContentDetailHeader = ({ content }: ContentDetailHeaderProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: Content['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'processing':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      case 'queued':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getContentTypeIcon = (type: Content['type']) => {
    switch (type) {
      case 'file':
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'snippet':
        return <Code className="h-5 w-5 text-muted-foreground" />;
      case 'website':
        return <Globe className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home/automation/ai/content-center')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {getContentTypeIcon(content.type)}
            <h1 className="text-2xl font-semibold tracking-tight">{content.title}</h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            {content.description}
          </p>
          <Badge className={`${getStatusColor(content.status)} text-white capitalize`}>
            {content.status}
          </Badge>
        </div>
      </div>
    </div>
  );
};
