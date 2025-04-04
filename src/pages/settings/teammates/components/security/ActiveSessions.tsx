import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammateSessions, terminateSession } from '@/store/slices/teammates/actions';
import { selectTeammateSessions } from '@/store/slices/teammates/selectors';
import { Monitor, Smartphone, Laptop, Globe, Loader, X } from 'lucide-react';
import { formatDistance } from 'date-fns';
import type { RootState } from '@/store/store';

interface ActiveSessionsProps {
  teammateId: string;
}

export const ActiveSessions: React.FC<ActiveSessionsProps> = ({ teammateId }) => {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((state) => selectTeammateSessions(state, teammateId));
  const loading = useAppSelector((state) => state.teammates?.loading || false);

  useEffect(() => {
    dispatch(fetchTeammateSessions(teammateId));
  }, [dispatch, teammateId]);

  const handleTerminateSession = (sessionId: string) => {
    dispatch(terminateSession({ teammateId, sessionId }));
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return <Laptop className="h-4 w-4 mr-2" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4 mr-2" />;
      case 'tablet':
        return <Monitor className="h-4 w-4 mr-2" />;
      default:
        return <Globe className="h-4 w-4 mr-2" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No active sessions found.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  {getDeviceIcon(session.deviceType)}
                  <div>
                    <p className="font-medium">{session.deviceName}</p>
                    <div className="text-sm text-muted-foreground">
                      <span>{session.location}</span> • Last active{' '}
                      {formatDistance(new Date(session.lastActive), new Date(), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleTerminateSession(session.id)}
                >
                  <X className="h-4 w-4 mr-1" /> Terminate
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
