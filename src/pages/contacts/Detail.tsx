
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactBasicInfo } from '@/components/contacts/detail/ContactBasicInfo';
import { ContactTimeline } from '@/components/contacts/detail/ContactTimeline';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { CustomerSentiment } from '@/components/contacts/detail/CustomerSentiment';
import { MostUsedInfo } from '@/components/contacts/detail/MostUsedInfo';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Activity } from '@/types/activity';

const ContactDetail = () => {
  const { id } = useParams();
  const contact = useAppSelector((state) => 
    state.contacts.contacts.find((c) => c.id === id)
  );

  // Mock activities data with correct types
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

  if (!contact) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Contact not found
        </Card>
      </div>
    );
  }

  const needsAttention = contact.status === 'active' && !contact.lastContacted;

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px]">
      <ContactDetailHeader contact={contact} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Column (4/12 width) - Contact Information */}
        <div className="lg:col-span-4 space-y-4">
          {needsAttention && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-700">This contact needs attention</p>
            </div>
          )}

          <ContactDetailSidebar contact={contact} />
          <ContactBasicInfo contact={contact} />
          <CustomerSentiment activities={activities} />
          <MostUsedInfo contact={contact} />
        </div>

        {/* Right Column (8/12 width) - Activity Timeline */}
        <div className="lg:col-span-8">
          <ContactTimeline contact={contact} />
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
