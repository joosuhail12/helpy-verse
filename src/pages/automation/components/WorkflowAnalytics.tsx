
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { 
  CircleCheck, 
  CircleX, 
  History, 
  Clock, 
  BarChart, 
  Calendar 
} from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { WorkflowMetrics, WorkflowRun } from '@/types/workflow';

interface WorkflowMetricsCardProps {
  metrics?: WorkflowMetrics;
  runs?: WorkflowRun[];
  className?: string;
}

export function WorkflowMetricsCard({ metrics, runs = [], className = '' }: WorkflowMetricsCardProps) {
  // Default metrics if none provided
  const defaultMetrics: WorkflowMetrics = {
    totalRuns: 0,
    successRate: 0,
    failedRuns: 0,
    successfulRuns: 0,
  };
  
  const workflowMetrics = metrics || defaultMetrics;
  
  // Get last 5 runs for timeline
  const recentRuns = runs.slice(0, 5);
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Workflow Analytics
        </CardTitle>
        <CardDescription>
          Performance metrics and history
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            {/* Total Runs */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Runs</span>
              </div>
              <span className="font-semibold">{workflowMetrics.totalRuns}</span>
            </div>
            
            {/* Success Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">{Math.round(workflowMetrics.successRate * 100)}%</span>
              </div>
              <Progress 
                value={workflowMetrics.successRate * 100} 
                className="h-2"
              />
            </div>
            
            {/* Success/Failure Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">{workflowMetrics.successfulRuns} successful</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleX className="h-4 w-4 text-destructive" />
                <span className="text-sm">{workflowMetrics.failedRuns} failed</span>
              </div>
            </div>
            
            {/* Average Duration */}
            {workflowMetrics.averageDuration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Avg. {Math.round(workflowMetrics.averageDuration / 1000)}s per run
                </span>
              </div>
            )}
          </div>
          
          {/* Recent Activity Timeline */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
            {recentRuns.length > 0 ? (
              <div className="space-y-2.5">
                {recentRuns.map(run => (
                  <div key={run.id} className="relative pl-5 pb-3 border-l border-muted">
                    <div 
                      className={`absolute top-0 left-0 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
                        run.status === 'success' ? 'bg-green-500' : 
                        run.status === 'failed' ? 'bg-destructive' :
                        'bg-amber-500'
                      }`}
                    />
                    <p className="text-xs font-medium">
                      Run {run.status}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(run.startTime, "MMM d, HH:mm")}</span>
                    </div>
                    {run.duration && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{(run.duration / 1000).toFixed(2)}s</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 border rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">No runs recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
