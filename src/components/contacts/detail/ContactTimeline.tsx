
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface ContactTimelineProps {
  contact: Contact;
}

export const ContactTimeline = ({ contact }: ContactTimelineProps) => {
  // Mock timeline data - this would come from your backend
  const activities = [
    {
      id: '1',
      type: 'email',
      description: 'Sent follow-up email',
      date: new Date(contact.lastContacted || new Date()).toISOString(),
    },
    {
      id: '2',
      type: 'note',
      description: 'Added new contact information',
      date: new Date(contact.createdAt).toISOString(),
    },
  ];

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
