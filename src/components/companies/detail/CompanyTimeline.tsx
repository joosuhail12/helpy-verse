
import { Company } from '@/types/company';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { 
  Mail, MessageSquare, Phone, FileText, Clock, 
  CalendarCheck, Calendar, Check, AlertCircle, Activity
} from 'lucide-react';

interface CompanyTimelineProps {
  company: Company;
}

export const CompanyTimeline = ({ company }: CompanyTimelineProps) => {
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  useEffect(() => {
    // In a real implementation, fetch timeline events from an API
    const mockEvents = [
      {
        id: '1',
        type: 'email',
        title: 'Email Received',
        description: 'Quarterly review discussion',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user: 'Sarah Johnson'
      },
      {
        id: '2',
        type: 'note',
        title: 'Note Added',
        description: 'Discussed renewal options for next quarter',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Michael Thompson'
      },
      {
        id: '3',
        type: 'call',
        title: 'Call Completed',
        description: 'Introduction call with new procurement manager',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Robert Williams'
      },
      {
        id: '4',
        type: 'meeting',
        title: 'Meeting Scheduled',
        description: 'Annual contract review',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'System'
      },
      {
        id: '5',
        type: 'status',
        title: 'Status Changed',
        description: 'Company status updated to Active',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'System'
      }
    ];
    
    setTimelineEvents(mockEvents);
  }, [company.id]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'note':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case 'meeting':
        return <CalendarCheck className="h-4 w-4 text-amber-500" />;
      case 'status':
        return <Activity className="h-4 w-4 text-red-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `In ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  return (
    <Card className="bg-white border-purple-100/50 h-[calc(100vh-300px)] shadow-lg shadow-purple-500/5">
      <ScrollArea className="h-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-purple-900">Activity Timeline</h3>
          
          {timelineEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Activity className="h-10 w-10 text-gray-300 mb-3" />
              <h4 className="text-gray-600 font-medium mb-1">No activities yet</h4>
              <p className="text-gray-400 text-sm">
                Activities with this company will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gray-200 before:-z-10">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-4 group">
                  <div className="bg-white flex items-center justify-center rounded-full border border-gray-200 p-2 z-10">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>By {event.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
