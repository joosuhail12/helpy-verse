
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from '@/components/ui/card';
import { Timer, CheckCircle, XCircle } from 'lucide-react';

export const ProcessingMetrics = () => {
  const items = useAppSelector((state) => state.content.items);
  
  // Calculate average processing time (mock data - would come from API)
  const avgProcessingTime = "2.5 minutes";
  
  // Calculate success/failure rates
  const completedItems = items.filter(item => item.status === 'completed').length;
  const failedItems = items.filter(item => item.status === 'failed').length;
  const totalProcessed = completedItems + failedItems;
  
  const successRate = totalProcessed > 0 
    ? ((completedItems / totalProcessed) * 100).toFixed(1)
    : "0";
  const failureRate = totalProcessed > 0 
    ? ((failedItems / totalProcessed) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Timer className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Processing Time</p>
            <p className="text-2xl font-semibold">{avgProcessingTime}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            <p className="text-2xl font-semibold">{successRate}%</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Failure Rate</p>
            <p className="text-2xl font-semibold">{failureRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
