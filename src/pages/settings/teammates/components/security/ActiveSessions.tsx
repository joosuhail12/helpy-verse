
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe, Laptop, Smartphone, LogOut } from 'lucide-react';
import { fetchSessions, revokeSession } from '@/store/slices/securitySlice';
import { format } from 'date-fns';

interface ActiveSessionsProps {
  teammateId: string;
}

const ActiveSessions = ({ teammateId }: ActiveSessionsProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sessions = useAppSelector(state => 
    state.security.sessions[teammateId] || []
  );

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchSessions(teammateId)).unwrap();
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load active sessions.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSessions();
  }, [teammateId, dispatch]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await dispatch(revokeSession({ teammateId, sessionId })).unwrap();
      toast({
        description: "Session has been revoked successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to revoke session. Please try again.",
      });
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Laptop className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Active Sessions</h3>
        <p className="text-sm text-gray-500">
          Manage your active sessions across different devices
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {getDeviceIcon(session.deviceType)}
                <div>
                  <p className="font-medium">{session.deviceName}</p>
                  <p className="text-sm text-gray-500">
                    Last active: {format(new Date(session.lastActive), 'PPp')}
                  </p>
                  <p className="text-sm text-gray-500">{session.location}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRevokeSession(session.id)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Revoke
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveSessions;
