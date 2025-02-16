
import { Activity, ActivityType } from '@/types/activity';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import {
  Mail,
  Ticket,
  StickyNote,
  Phone,
  Calendar,
  Building2,
  MessageCircle
} from 'lucide-react';

interface CompanyActivityTimelineProps {
  activities: Activity[];
}

export const CompanyActivityTimeline = ({ activities }: CompanyActivityTimelineProps) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'ticket':
        return <Ticket className="h-4 w-4 text-purple-500" />;
      case 'note':
        return <StickyNote className="h-4 w-4 text-yellow-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case 'company_update':
        return <Building2 className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (category: string) => {
    switch (category) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'negative':
        return 'border-red-200 bg-red-50';
      case 'update':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="h-full bg-white/60 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-500/5">
      <CardHeader className="border-b border-gray-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Activity Timeline</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[600px]">
        <CardContent className="pt-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative pl-6 pb-8 last:pb-0"
            >
              <div className="absolute left-0 top-0 h-full w-px bg-gray-200">
                <div className={`absolute -left-[5px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                  getActivityColor(activity.metadata.category)
                }`} />
              </div>
              <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.metadata.category)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                  {activity.metadata.responseTime && (
                    <p className="text-xs text-gray-500">
                      Response time: {activity.metadata.responseTime} minutes
                    </p>
                  )}
                  {activity.metadata.status && (
                    <p className="text-xs text-gray-500">
                      Status: {activity.metadata.status}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No activities recorded yet</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

