
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ActivityIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Company } from '@/types/company';

interface CompanyActivityProps {
  company: Company;
}

export const CompanyActivity: React.FC<CompanyActivityProps> = ({ company }) => {
  // Mock activities for now
  const activities = [
    {
      id: '1',
      type: 'note',
      description: 'Added a new note about the company strategy',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: {
        name: 'Alex Johnson',
        avatar: '/assets/avatars/avatar-1.png',
      },
    },
    {
      id: '2',
      type: 'email',
      description: 'Sent follow-up email about the new proposal',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        name: 'Sarah Miller',
        avatar: '/assets/avatars/avatar-2.png',
      },
    },
    {
      id: '3',
      type: 'meeting',
      description: 'Scheduled quarterly review meeting',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        name: 'David Chen',
        avatar: '/assets/avatars/avatar-3.png',
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ActivityIcon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.user.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(activity.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p>No recent activity recorded</p>
            <p className="text-sm mt-1">Activities will appear here when they happen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyActivity;
