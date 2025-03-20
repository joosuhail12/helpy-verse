
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const ContentSummary = () => {
  const contentState = useAppSelector((state) => state.content);
  const items = contentState?.items || [];

  const metrics = {
    total: items.length,
    active: items.filter(item => item.status === 'completed').length,
    failed: items.filter(item => item.status === 'failed').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Content</p>
            <p className="text-2xl font-semibold">{metrics.total}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Content</p>
            <p className="text-2xl font-semibold">{metrics.active}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed Content</p>
            <p className="text-2xl font-semibold">{metrics.failed}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
