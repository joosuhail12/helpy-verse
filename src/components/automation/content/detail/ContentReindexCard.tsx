
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Content } from '@/types/content';

interface ContentReindexCardProps {
  content: Content;
}

export const ContentReindexCard = ({ content }: ContentReindexCardProps) => {
  const [isReindexing, setIsReindexing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleReindex = async () => {
    setIsReindexing(true);
    setProgress(0);

    try {
      // Simulate reindexing progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }

      toast({
        title: 'Reindexing complete',
        description: 'Content has been successfully reindexed.',
      });
    } catch (error) {
      toast({
        title: 'Reindexing failed',
        description: 'There was an error while reindexing the content.',
        variant: 'destructive',
      });
    } finally {
      setIsReindexing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Content Reindexing</h3>
          <p className="text-sm text-muted-foreground">
            Reindex this content to update its searchable data
          </p>
        </div>

        {isReindexing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">
              Reindexing... {progress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleReindex}
          disabled={isReindexing}
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {isReindexing ? 'Reindexing...' : 'Start Reindex'}
        </Button>
      </div>
    </Card>
  );
};
