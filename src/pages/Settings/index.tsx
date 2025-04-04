
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = React.useState(true);
  const [apiConnected, setApiConnected] = React.useState(false);
  const navigate = useNavigate();

  // Check authentication and API connection on component mount
  useEffect(() => {
    const isAuth = isAuthenticated();
    
    if (!isAuth) {
      console.log("Settings: Not authenticated, redirecting to sign-in");
      navigate("/sign-in", { replace: true });
      return;
    }

    // Check API connection
    HttpClient.checkApiConnection()
      .then(isConnected => {
        console.log("Settings: API connection status:", isConnected);
        setApiConnected(isConnected);
        
        if (!isConnected) {
          toast({
            title: "Connection Issue",
            description: "Unable to connect to the API. Some settings may be unavailable.",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white rounded-lg shadow">
        {!apiConnected && (
          <div className="bg-orange-50 text-orange-800 p-4 mb-4 rounded-md">
            Warning: Unable to connect to the API. Settings may not be fully functional.
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
