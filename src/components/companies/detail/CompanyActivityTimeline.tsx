
import { Activity } from '@/types/activity';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface CompanyActivityTimelineProps {
  activities: Activity[];
}

export const CompanyActivityTimeline = ({ activities }: CompanyActivityTimelineProps) => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(activity.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
