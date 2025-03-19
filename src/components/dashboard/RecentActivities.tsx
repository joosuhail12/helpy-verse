
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mail, MessageSquare, Phone } from 'lucide-react';

export const RecentActivities = () => {
  const activities = [
    {
      id: '1',
      type: 'email',
      title: 'Support Request',
      user: 'John Doe',
      time: '10 minutes ago'
    },
    {
      id: '2',
      type: 'call',
      title: 'Sales Call',
      user: 'Emma Wilson',
      time: '1 hour ago'
    },
    {
      id: '3',
      type: 'message',
      title: 'Chat Support',
      user: 'Mike Brown',
      time: '2 hours ago'
    },
    {
      id: '4',
      type: 'note',
      title: 'Customer Feedback',
      user: 'Sara Taylor',
      time: '3 hours ago'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start">
              <div className={`rounded-full p-2 mr-3 ${
                activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'call' ? 'bg-green-100 text-green-600' :
                activity.type === 'message' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-muted-foreground">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
