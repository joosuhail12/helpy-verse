
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface CompanyActivityProps {
  company: any; // Replace with actual Company type
}

export const CompanyActivity: React.FC<CompanyActivityProps> = ({ company }) => {
  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'contact_added',
      description: 'New contact John Doe added',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: 'Sarah Adams',
    },
    {
      id: '2',
      type: 'note_added',
      description: 'New note added to company',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      user: 'Mike Johnson',
    },
    {
      id: '3',
      type: 'status_updated',
      description: 'Company status updated to Active',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      user: 'Emily Chen',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact_added':
        return '👤';
      case 'note_added':
        return '📝';
      case 'status_updated':
        return '🔄';
      default:
        return '📋';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-4 border-b">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(activity.date)} ago by {activity.user}
                  </p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No recent activity
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CompanyActivity;
