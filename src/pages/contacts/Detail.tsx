
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchContactById } from '@/store/slices/contacts/contactsSlice';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactTabs } from '@/components/contacts/detail/ContactTabs';
import { ContactSidebar } from '@/components/contacts/detail/ContactSidebar';
import { Contact } from '@/types/contact';
import { Activity } from '@/types/activity';
import { Loading } from '@/components/Loading';

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { contacts, loading, error } = useAppSelector((state) => state.contacts);
  const [contact, setContact] = useState<Contact | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!loading && contacts) {
      const foundContact = contacts.find(c => c.id === id);
      if (foundContact) {
        setContact(foundContact);

        // Sample activities - would typically come from an API
        const sampleActivities: Activity[] = [
          {
            id: '1',
            type: 'email',
            title: 'Support Follow-up',
            description: 'Followed up on previous ticket regarding account access',
            timestamp: new Date().toISOString(),
            date: new Date().toISOString(),
            user: 'Support Agent',
            metadata: {
              subject: 'Re: Account Access Issue'
            }
          },
          {
            id: '2',
            type: 'note',
            title: 'Customer Call Notes',
            description: 'Customer mentioned they are considering upgrading their plan',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            date: new Date(Date.now() - 86400000).toISOString(),
            user: 'Sales Rep',
            metadata: {
              content: 'Interested in Enterprise features. Follow up next week.'
            }
          },
          {
            id: '3',
            type: 'task',
            title: 'Schedule Demo',
            description: 'Schedule product demo for new features',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            date: new Date(Date.now() - 172800000).toISOString(),
            user: 'Account Manager',
            metadata: {
              taskName: 'Product Demo',
              status: 'Pending'
            }
          }
        ];
        
        setActivities(sampleActivities);
      }
    }
  }, [contacts, loading, id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-6">Error loading contact: {error}</div>;
  }

  if (!contact) {
    return <div className="p-6">Contact not found</div>;
  }

  return (
    <div className="container mx-auto">
      <ContactDetailHeader contact={contact} />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <ContactTabs 
            contact={contact} 
            contactId={contact.id} 
          />
        </div>
        <ContactSidebar contact={contact} />
      </div>
    </div>
  );
};

export default ContactDetail;
