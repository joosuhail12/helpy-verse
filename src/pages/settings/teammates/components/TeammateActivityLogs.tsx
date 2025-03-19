
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Activity } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatDistanceToNow } from "date-fns";
import { selectTeammateActivities } from "@/store/slices/teammates/selectors";

interface TeammateActivityLogsProps {
  teammateId: string;
}

const TeammateActivityLogs = ({ teammateId }: TeammateActivityLogsProps) => {
  const activities = useAppSelector(state => selectTeammateActivities(state, teammateId));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-blue-100 text-blue-800";
      case "update":
        return "bg-yellow-100 text-yellow-800";
      case "permission_change":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No activity logs available
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeammateActivityLogs;
