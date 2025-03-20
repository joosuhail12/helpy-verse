
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
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import ContactsErrorBoundary from '@/components/contacts/ContactsErrorBoundary';

const AllContacts = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectContacts);
  const loading = useAppSelector(selectContactsLoading);
  const error = useAppSelector(selectContactsError);
  const [retryCount, setRetryCount] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  useEffect(() => {
    console.log('AllContacts component mounted, fetching customers');
    setIsTimedOut(false);
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Request taking longer than expected, showing timeout UI');
        setIsTimedOut(true);
      }
    }, 10000); // Show timeout UI after 10 seconds of loading
    
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
      
    return () => clearTimeout(timeoutId);
  }, [dispatch, retryCount]);

  // Debug logging
  useEffect(() => {
    console.log('Contacts state:', { 
      loading, 
      contactsCount: contacts?.length, 
      error,
      isTimedOut,
      contactsData: contacts 
    });
  }, [loading, contacts, error, isTimedOut]);

  // Show extended loading state with timeout message
  if (loading) {
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
                  onClick={() => {
                    console.log('Retrying fetch customers');
                    setRetryCount(prev => prev + 1);
                  }}
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
            onClick={() => {
              console.log('Retrying fetch customers');
              setRetryCount(prev => prev + 1);
            }} 
            className="mt-2"
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!contacts) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <p className="text-muted-foreground">No contacts data available</p>
          <Button 
            onClick={() => {
              console.log('Loading contacts');
              setRetryCount(prev => prev + 1);
            }} 
            className="mt-2"
          >
            Load Contacts
          </Button>
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
