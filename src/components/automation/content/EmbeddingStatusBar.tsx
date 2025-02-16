
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface EmbeddingStatus {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  currentFile?: string;
  totalFiles?: number;
  processedFiles?: number;
  error?: string;
}

export const EmbeddingStatusBar = () => {
  const [status, setStatus] = useState<EmbeddingStatus>({
    status: 'idle',
    progress: 0,
  });

  // TODO: Replace with actual API call to your Node.js backend
  useEffect(() => {
    // Mock status updates for demonstration
    const interval = setInterval(() => {
      setStatus(current => {
        if (current.status === 'completed' || current.status === 'error') {
          clearInterval(interval);
          return current;
        }
        
        const newProgress = current.progress + 10;
        if (newProgress >= 100) {
          return {
            status: 'completed',
            progress: 100,
            processedFiles: 5,
            totalFiles: 5,
          };
        }
        
        return {
          status: 'processing',
          progress: newProgress,
          currentFile: 'document-5.pdf',
          processedFiles: Math.floor(newProgress / 20),
          totalFiles: 5,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (status.status === 'idle') {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950 border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status.status === 'processing' && (
            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
          )}
          <h3 className="text-sm font-medium">
            {status.status === 'processing' && 'Processing Content'}
            {status.status === 'completed' && 'Processing Complete'}
            {status.status === 'error' && 'Processing Error'}
          </h3>
          <Badge
            variant={
              status.status === 'processing' ? 'secondary' :
              status.status === 'completed' ? 'default' :
              'destructive'
            }
            className="capitalize"
          >
            {status.status}
          </Badge>
        </div>
        {status.processedFiles && status.totalFiles && (
          <span className="text-sm text-gray-500">
            {status.processedFiles} / {status.totalFiles} files
          </span>
        )}
      </div>
      
      {status.currentFile && status.status === 'processing' && (
        <p className="text-sm text-gray-500">
          Currently processing: {status.currentFile}
        </p>
      )}
      
      <Progress value={status.progress} className="h-1.5" />
      
      {status.error && (
        <p className="text-sm text-red-500">{status.error}</p>
      )}
    </div>
  );
};
