
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactInformation } from './ContactInformation';
import { ContactTimeline } from './ContactTimeline';
import { ContactNotes } from './ContactNotes';
import { Contact } from '@/types/contact';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ContactTabsProps {
  contact: Contact;
  contactId: string;
}

export const ContactTabs: React.FC<ContactTabsProps> = ({ 
  contact,
  contactId
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const { user } = useAppSelector(state => state.auth || { user: { id: '1', name: 'Current User' } });
  const activities = useAppSelector(state => state.activities?.items || []);

  return (
    <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="info">Information</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-6">
        <ContactInformation 
          contact={contact}
          activities={activities} 
        />
      </TabsContent>
      
      <TabsContent value="timeline">
        <ContactTimeline 
          contact={contact}
        />
      </TabsContent>
      
      <TabsContent value="notes">
        <ContactNotes 
          contact={contact}
          currentUser={user?.id || '1'}
        />
      </TabsContent>
    </Tabs>
  );
};
