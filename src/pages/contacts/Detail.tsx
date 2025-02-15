
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactBasicInfo } from '@/components/contacts/detail/ContactBasicInfo';
import { ContactCustomFields } from '@/components/contacts/detail/ContactCustomFields';
import { ContactTimeline } from '@/components/contacts/detail/ContactTimeline';
import { ContactRelated } from '@/components/contacts/detail/ContactRelated';
import { ContactNotes } from '@/components/contacts/detail/ContactNotes';
import { ContactTags } from '@/components/contacts/detail/ContactTags';
import { CustomerSentiment } from '@/components/contacts/detail/CustomerSentiment';
import { MostUsedInfo } from '@/components/contacts/detail/MostUsedInfo';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { User, FileText, Clock, Users, StickyNote, Bell, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ContactDetailHeader contact={contact} />
      
      <div className="flex gap-8 mt-8">
        <div className="flex-1 space-y-6">
          {needsAttention && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-700">This contact needs attention</p>
            </div>
          )}

          <CustomerSentiment activities={activities} />
          <MostUsedInfo contact={contact} />

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-transparent p-0 h-auto space-x-6">
              <TabsTrigger 
                value="basic"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary"
              >
                <User className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary"
              >
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="custom"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary"
              >
                <FileText className="h-4 w-4" />
                Custom Fields
              </TabsTrigger>
              <TabsTrigger 
                value="related"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary"
              >
                <Users className="h-4 w-4" />
                Related
              </TabsTrigger>
              <TabsTrigger 
                value="notes"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary"
              >
                <StickyNote className="h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-0 space-y-6">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ContactBasicInfo contact={contact} />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <ContactTimeline contact={contact} />
            </TabsContent>

            <TabsContent value="custom" className="mt-0">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    <h3 className="text-lg font-semibold">Custom Fields</h3>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ContactCustomFields contact={contact} />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="related" className="mt-0">
              <ContactRelated contact={contact} />
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <ContactNotes contact={contact} />
            </TabsContent>
          </Tabs>
        </div>

        <ContactDetailSidebar contact={contact} />
      </div>
    </div>
  );
};

export default ContactDetail;
