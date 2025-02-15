
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactBasicInfo } from '@/components/contacts/detail/ContactBasicInfo';
import { ContactCustomFields } from '@/components/contacts/detail/ContactCustomFields';
import { ContactTimeline } from '@/components/contacts/detail/ContactTimeline';
import { ContactRelated } from '@/components/contacts/detail/ContactRelated';
import { ContactNotes } from '@/components/contacts/detail/ContactNotes';
import { ContactTags } from '@/components/contacts/detail/ContactTags';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { User, FileText, Clock, Users, StickyNote } from 'lucide-react';

const ContactDetail = () => {
  const { id } = useParams();
  const contact = useAppSelector((state) => 
    state.contacts.contacts.find((c) => c.id === id)
  );

  if (!contact) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Contact not found
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ContactDetailHeader contact={contact} />
      
      <div className="flex gap-8 mt-8">
        <div className="flex-1">
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

            <TabsContent value="basic" className="mt-0">
              <ContactBasicInfo contact={contact} />
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <ContactTimeline contact={contact} />
            </TabsContent>

            <TabsContent value="custom" className="mt-0">
              <ContactCustomFields contact={contact} />
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
