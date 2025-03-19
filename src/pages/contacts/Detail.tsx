
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingState } from '@/components/contacts/LoadingState';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactInformation } from '@/components/contacts/detail/ContactInformation';
import { ContactTimeline } from '@/components/contacts/detail/ContactTimeline';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { fetchContact } from '@/store/slices/contacts/contactsSlice';
import { Activity } from '@/types/activity';
import { ContactTickets } from '@/components/contacts/detail/ContactTickets';

const ContactDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const {
    selectedContact: contact,
    loading,
    error
  } = useAppSelector(state => state.contacts);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchContact(id));
    }
    
    // Mock activities data
    setActivities([
      {
        id: '1',
        type: 'email',
        description: 'Sent follow-up email',
        content: 'Thanks for your interest in our product. Would you like to schedule a demo?',
        date: new Date().toISOString(),
        metadata: {
          category: 'neutral',
          status: 'sent'
        }
      },
      {
        id: '2',
        type: 'note',
        description: 'Added note',
        content: 'Customer requested information about enterprise pricing',
        date: new Date(Date.now() - 86400000).toISOString(),
        metadata: {
          category: 'positive'
        }
      }
    ]);
  }, [id, dispatch]);
  
  if (loading || !contact) {
    return <LoadingState />;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  
  const contactName = `${contact.firstname} ${contact.lastname}`;
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <ContactDetailHeader contact={contact} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <ContactInformation 
            contact={contact} 
            activities={activities} 
          />
          
          <ContactTickets 
            contactId={contact.id} 
            contactName={contactName}
          />
          
          <ContactTimeline 
            activities={activities} 
            contactId={contact.id} 
          />
        </div>
        
        <div className="space-y-6">
          <ContactDetailSidebar contact={contact} />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;
