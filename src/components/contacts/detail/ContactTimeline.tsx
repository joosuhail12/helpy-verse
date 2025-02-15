
import { useState } from 'react';
import { Contact } from '@/types/contact';
import { Activity, ActivityType, InteractionMetrics } from '@/types/activity';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity as ActivityIcon,
  Mail,
  Ticket,
  Phone,
  Calendar,
  StickyNote,
  Clock,
  BarChart
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContactTimelineProps {
  contact: Contact;
}

export const ContactTimeline = ({ contact }: ContactTimelineProps) => {
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');

  // Mock data - replace with real data from your API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      description: 'Sent follow-up email',
      date: new Date(contact.lastContacted || new Date()).toISOString(),
      metadata: {
        responseTime: 25,
      },
    },
    {
      id: '2',
      type: 'note',
      description: 'Added new contact information',
      date: new Date(contact.createdAt).toISOString(),
    },
    {
      id: '3',
      type: 'ticket',
      description: 'Created support ticket #1234',
      date: new Date(Date.now() - 86400000).toISOString(),
      metadata: {
        status: 'open',
      },
    },
  ];

  const metrics: InteractionMetrics = {
    totalInteractions: activities.length,
    averageResponseTime: 32, // minutes
    mostFrequentType: 'email',
    lastInteraction: activities[0]?.date || new Date().toISOString(),
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'ticket':
        return <Ticket className="h-4 w-4" />;
      case 'note':
        return <StickyNote className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const filteredActivities = activities.filter(
    activity => selectedType === 'all' || activity.type === selectedType
  );

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Activities</CardTitle>
          </div>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as ActivityType | 'all')}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="ticket">Tickets</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{metrics.totalInteractions}</p>
              <p className="text-xs text-muted-foreground">Total Interactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">{metrics.averageResponseTime}min</p>
              <p className="text-xs text-muted-foreground">Avg. Response Time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getActivityIcon(metrics.mostFrequentType)}
            <div>
              <p className="text-sm font-medium capitalize">{metrics.mostFrequentType}</p>
              <p className="text-xs text-muted-foreground">Most Frequent</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4 p-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 items-start border-l-2 border-gray-200 pl-4 pb-4 last:pb-0 relative"
              >
                <div className="absolute -left-[9px] top-0 bg-background p-1 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{activity.description}</p>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                  {activity.metadata?.responseTime && (
                    <p className="text-xs text-muted-foreground">
                      Response time: {activity.metadata.responseTime} minutes
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
