
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomers, selectContacts, selectContactsLoading, selectContactsError } from '@/store/slices/contacts/contactsSlice';
import ContactList from '@/components/contacts/ContactList';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactListControls } from '@/components/contacts/ContactListControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, Clock, RefreshCw, WifiOff, ServerCrash } from 'lucide-react';
import ContactsErrorBoundary from '@/components/contacts/ContactsErrorBoundary';
import { HttpClient } from '@/api/services/http/client';

const AllContacts = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectContacts);
  const loading = useAppSelector(selectContactsLoading);
  const error = useAppSelector(selectContactsError);
  const [retryCount, setRetryCount] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  
  // Check API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      setIsCheckingConnection(true);
      setConnectionStatus('checking');
      try {
        const isConnected = await HttpClient.checkApiConnection();
        setConnectionStatus(isConnected ? 'online' : 'error');
      } catch (error) {
        console.error('Error checking connection:', error);
        setConnectionStatus(navigator.onLine ? 'error' : 'offline');
      } finally {
        setIsCheckingConnection(false);
      }
    };
    
    checkConnection();
  }, [retryCount]);
  
  useEffect(() => {
    console.log('AllContacts component mounted, fetching customers');
    setIsTimedOut(false);
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Request taking longer than expected, showing timeout UI');
        setIsTimedOut(true);
      }
    }, 10000); // Show timeout UI after 10 seconds of loading
    
    if (connectionStatus === 'online') {
      dispatch(fetchCustomers())
        .unwrap()
        .then(() => {
          console.log('Successfully fetched contacts');
          setIsTimedOut(false);
        })
        .catch((err) => {
          console.error('Error fetching contacts:', err);
          
          // Check if it's a timeout error
          if (err.isTimeoutError) {
            setIsTimedOut(true);
          }
          
          toast({
            title: 'Error loading contacts',
            description: err.message || 'Please try again later',
            variant: 'destructive'
          });
        });
    }
      
    return () => clearTimeout(timeoutId);
  }, [dispatch, retryCount, connectionStatus]);

  // Debug logging
  useEffect(() => {
    console.log('Contacts state:', { 
      loading, 
      contactsCount: contacts?.length, 
      error,
      isTimedOut,
      connectionStatus,
      contactsData: contacts 
    });
  }, [loading, contacts, error, isTimedOut, connectionStatus]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Show connection error states
  if (connectionStatus === 'offline') {
    return (
      <div className="p-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <WifiOff className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">You're offline</h3>
          <p className="text-muted-foreground mb-6">
            Please check your internet connection and try again.
          </p>
          <Button onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  if (connectionStatus === 'error' && !loading) {
    return (
      <div className="p-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <ServerCrash className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Unable to connect to server</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't connect to the API server. Please check your network connection and server status.
          </p>
          <Button onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  // Show extended loading state with timeout message
  if (loading || isCheckingConnection) {
    return (
      <div className="p-6">
        <Card className="p-4">
          {isTimedOut ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Clock className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Taking longer than expected...</h3>
              <p className="text-muted-foreground mb-6">
                We're still trying to load your contacts. This might take a few more moments.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={handleRetry}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Error loading contacts</p>
          </div>
          <p className="mb-4">{error}</p>
          <Button 
            onClick={handleRetry} 
            className="mt-2"
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <p className="text-muted-foreground text-center mb-4">No contacts data available</p>
          <div className="flex justify-center">
            <Button 
              onClick={handleRetry} 
              className="mt-2"
            >
              Load Contacts
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ContactsHeader />
      <ContactListControls />
      <ContactsErrorBoundary>
        <ContactList contacts={contacts || []} loading={loading} />
      </ContactsErrorBoundary>
    </div>
  );
};

export default AllContacts;
