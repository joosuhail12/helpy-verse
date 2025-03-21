
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammateActivities } from '@/store/slices/teammates/actions';
import { selectTeammateActivities } from '@/store/slices/teammates/selectors';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TeammateActivityLogsProps {
  teammateId: string;
}

const TeammateActivityLogs = ({ teammateId }: TeammateActivityLogsProps) => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector(state => selectTeammateActivities(state, teammateId));
  
  useEffect(() => {
    dispatch(fetchTeammateActivities(teammateId));
  }, [dispatch, teammateId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activity logs available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeammateActivityLogs;
