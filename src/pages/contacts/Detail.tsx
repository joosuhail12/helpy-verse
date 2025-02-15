
import { useParams, useNavigate } from 'react-router-dom';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useToast } from '@/hooks/use-toast';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contact = useAppSelector((state) => 
    state.contacts.contacts.find((c) => c.id === id)
  );
  const isLoading = useAppSelector((state) => state.contacts.loading);
  const error = useAppSelector((state) => state.contacts.error);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="border-b pb-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading contact",
      description: error,
      variant: "destructive",
    });
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Contact</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate('/home/contacts/all')}
            className="mt-4 text-primary hover:underline"
          >
            Return to Contacts
          </button>
        </Card>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Contact Not Found</h2>
          <p className="text-gray-600">The contact you're looking for doesn't exist or has been deleted.</p>
          <button 
            onClick={() => navigate('/home/contacts/all')}
            className="mt-4 text-primary hover:underline"
          >
            Return to Contacts
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Breadcrumbs
        items={[
          { label: 'Contacts', href: '/home/contacts/all' },
          { label: `${contact.firstName} ${contact.lastName}`, href: '#' },
        ]}
      />
      
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
