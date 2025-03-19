
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, FileText, RefreshCw } from 'lucide-react';

const activities = [
  {
    id: '1',
    type: 'message',
    content: 'Sarah replied to #1234',
    timestamp: '5 minutes ago',
  },
  {
    id: '2',
    type: 'user',
    content: 'New user John Smith registered',
    timestamp: '2 hours ago',
  },
  {
    id: '3',
    type: 'ticket',
    content: 'Ticket #5678 marked as resolved',
    timestamp: '3 hours ago',
  },
  {
    id: '4',
    type: 'system',
    content: 'System maintenance completed',
    timestamp: '5 hours ago',
  },
];

export const RecentActivities = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'ticket':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="bg-muted p-2 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.content}</p>
                <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
