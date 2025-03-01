
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactInformation } from '@/components/contacts/detail/ContactInformation';
import { ContactTimeline } from '@/components/contacts/detail/ContactTimeline';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { ContactCustomObjectData } from '@/components/contacts/detail/ContactCustomObjectData';
import { ContactRelated } from '@/components/contacts/detail/ContactRelated';
import { Card } from '@/components/ui/card';
import { Bell, Loader } from 'lucide-react';
import { Activity } from '@/types/activity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactTickets } from '@/components/contacts/detail/ContactTickets';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomerDetails } from '@/store/slices/contacts/contactsSlice';

const ContactDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { contactDetails, loading, error } = useAppSelector((state) => state.contacts);
  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetails(id));
    }
  }, [id, dispatch]);

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

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-4 text-center">
          <Loader className="animate-spin" /> {/* Show loading animation */}
          <p className="mt-2 text-gray-500">Loading contact details...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Error: {error}
        </Card>
      </div>
    );
  }

  if (!contactDetails) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Contact not found
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
