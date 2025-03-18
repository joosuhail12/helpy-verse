
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  date: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface CompanyActivityProps {
  companyId: string;
}

export const CompanyActivity: React.FC<CompanyActivityProps> = ({ companyId }) => {
  // This would be fetched from the API in a real application
  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Email sent',
      description: 'Follow-up email about partnership opportunity',
      date: '2023-06-15T10:30:00',
      user: {
        id: '1',
        name: 'John Doe',
        avatar: '/avatars/john-doe.png',
      },
    },
    {
      id: '2',
      type: 'meeting',
      title: 'Video call',
      description: 'Quarterly business review',
      date: '2023-06-10T14:00:00',
      user: {
        id: '2',
        name: 'Jane Smith',
        avatar: '/avatars/jane-smith.png',
      },
    },
  ];

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                      <img src={activity.user.avatar} alt={activity.user.name} />
                    </div>
                    <span className="text-xs">{activity.user.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activity recorded yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CompanyActivity;
