
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInformation } from './ContactInformation';
import { ContactNotes } from './ContactNotes';
import { ContactTickets } from './ContactTickets';
import { ContactTimeline } from './ContactTimeline';
import type { Contact } from '@/types/contact';

interface ContactTabsProps {
  contact: Contact;
  contactId: string;
  contactName: string;
}

export const ContactTabs = ({ contact, contactId, contactName }: ContactTabsProps) => {
  return (
    <Tabs defaultValue="information" className="p-6">
      <TabsList className="mb-4">
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="information">
        <ContactInformation contact={contact} />
      </TabsContent>
      
      <TabsContent value="activity">
        <ContactTimeline contactId={contactId} />
      </TabsContent>
      
      <TabsContent value="tickets">
        <ContactTickets contactId={contactId} contactName={contactName} />
      </TabsContent>
      
      <TabsContent value="notes">
        <ContactNotes contact={contact} />
      </TabsContent>
    </Tabs>
  );
};
