
<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
=======
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactInformation } from '@/components/contacts/detail/ContactInformation';
import { ContactTimeline } from '@/components/contacts/detail/ContactTimeline';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { ContactCustomObjectData } from '@/components/contacts/detail/ContactCustomObjectData';
import { ContactRelated } from '@/components/contacts/detail/ContactRelated';
import { Card } from '@/components/ui/card';
import { Bell, Loader, AlertTriangle, RefreshCw } from 'lucide-react';
import { Activity } from '@/types/activity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactTickets } from '@/components/contacts/detail/ContactTickets';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
<<<<<<< HEAD
import { fetchContactDetails } from '@/store/slices/contacts/thunks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
=======
import { fetchCustomerDetails } from '@/store/slices/contacts/contactsSlice';
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const { contactDetails, loading, error } = useAppSelector((state) => state.contacts);
<<<<<<< HEAD

  const loadContactDetails = async () => {
=======
  console.log(contactDetails);
  
  useEffect(() => {
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
    if (id) {
      try {
        setIsRetrying(true);
        await dispatch(fetchContactDetails(id)).unwrap();
        setIsRetrying(false);
      } catch (error) {
        setIsRetrying(false);
        toast({
          title: "Error",
          description: "Failed to fetch contact details. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    loadContactDetails();
  }, [id, dispatch]);

  // Auto-retry once if there's an error (but only once to avoid infinite loops)
  useEffect(() => {
    if (error && retryCount < 1 && !isRetrying) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadContactDetails();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isRetrying]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadContactDetails();
  };

  const handleGoBack = () => {
    navigate('/home/contacts/all');
  };

  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      description: 'Sent follow-up email',
      date: new Date().toISOString(),
      metadata: {
        category: 'positive',
      },
    },
  ];

  if (loading || isRetrying) {
    return (
      <div className="p-6">
<<<<<<< HEAD
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading contact details...</p>
=======
        <Card className="p-4 text-center">
          <Loader className="h-6 w-6 animate-spin mx-auto text-gray-500" />
          <p className="mt-2 text-gray-500">Loading contact details...</p>
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-gray-800">Unable to load contact</h2>
          <p className="text-muted-foreground text-center max-w-md">
            There was a problem loading this contact's details. This may be due to a network issue or the contact may not exist.
          </p>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
            <Button variant="outline" onClick={handleGoBack}>
              Return to Contacts
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!contactDetails) {
    return (
      <div className="p-6">
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">Contact Not Found</h2>
          <p className="text-muted-foreground text-center">
            The contact you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="default" onClick={handleGoBack} className="mt-4">
            Return to Contacts
          </Button>
        </Card>
      </div>
    );
  }

  const needsAttention = contactDetails.status === 'active' && !contactDetails.lastContacted;

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px]">
      <ContactDetailHeader contact={contactDetails} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Column (4/12 width) - Contact Information */}
        <div className="lg:col-span-4">
          {needsAttention && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-700">This contact needs attention</p>
            </div>
          )}

          <ContactDetailSidebar contact={contactDetails} />
          <div className="mt-4 space-y-4">
            <ContactInformation contact={contactDetails} activities={activities} />
            <ContactRelated contact={contactDetails} />
            <ContactCustomObjectData contact={contactDetails} />
          </div>
        </div>

        {/* Right Column (8/12 width) - Activity Timeline & Tickets */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Activity Timeline</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <ContactTimeline contact={contactDetails} />
            </TabsContent>

            <TabsContent value="tickets">
              <ContactTickets contact={contactDetails} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
