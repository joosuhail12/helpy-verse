
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactInformation } from './ContactInformation';
import { ContactTimeline } from './ContactTimeline';
import { ContactNotes } from './ContactNotes';
import { Contact } from '@/types/contact';
import { Activity } from '@/types/activity';
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
  // Get the current user's ID from auth state
  const { user } = useAppSelector(state => state.auth);
  const userId = user?.data?.id || '1';
  const userName = 'Current User';
  
  // Use mock activities for now - in real app, these would come from a state/API
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Email Sent',
      description: 'Followed up on previous inquiry',
      timestamp: new Date().toISOString(),
      date: new Date().toISOString(),
      user: 'Support Agent',
      metadata: {
        subject: 'Re: Your Inquiry'
      }
    },
    {
      id: '2',
      type: 'note',
      title: 'Note Added',
      description: 'Customer requesting more information',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      date: new Date(Date.now() - 86400000).toISOString(),
      user: 'Sales Rep',
      metadata: {
        content: 'Customer needs more information about pricing.'
      }
    }
  ];

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
          activities={mockActivities} 
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
          currentUser={userId}
        />
      </TabsContent>
    </Tabs>
  );
};
