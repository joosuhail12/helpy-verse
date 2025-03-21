
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, File, ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Content } from '@/types/content';

interface ContentDetailHeaderProps {
  content: Content;
}

export const ContentDetailHeader = ({ content }: ContentDetailHeaderProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (content.status) {
      case 'active': return 'bg-green-50 text-green-600 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'draft': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'queued': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'completed': return 'bg-green-50 text-green-600 border-green-200';
      case 'failed': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6">
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-1" 
          onClick={() => navigate('/home/automation/ai/content-center')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">{content.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge className={getStatusColor()}>
            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
          </Badge>
          <span className="flex items-center">
            <File className="h-4 w-4 mr-1" />
            {content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Updated {formatDistanceToNow(new Date(content.lastUpdated))} ago
          </span>
          {content.lastEditedBy && (
            <span>by {content.lastEditedBy.name}</span>
          )}
        </div>
      </div>
      <div className="flex items-start">
        <Button>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Content
        </Button>
      </div>
    </div>
  );
};
