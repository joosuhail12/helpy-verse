
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactTabs } from '@/components/contacts/detail/ContactTabs';
import { ContactSidebar } from '@/components/contacts/detail/ContactSidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Loading } from '@/components/Loading';
import { Activity } from '@/types/activity';
import { fetchContactById } from '@/store/slices/contacts/contactsSlice';

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const contact = useAppSelector(state => state.contacts.contactDetails);
  const loading = useAppSelector(state => state.contacts.loading);
  const error = useAppSelector(state => state.contacts.error);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id));
    }
  }, [id, dispatch]);
  
  // Mock activities data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Email sent',
      description: 'Follow-up regarding your inquiry',
      timestamp: '2023-10-15T14:30:00Z',
      user: 'John Agent',
      metadata: {
        subject: 'Follow-up regarding your inquiry',
        content: 'Dear customer, I wanted to follow up on our conversation...'
      }
    },
    {
      id: '2',
      type: 'note',
      title: 'Note added',
      description: 'Customer prefers communication via email',
      timestamp: '2023-10-14T11:15:00Z',
      user: 'Sarah Support',
      metadata: {
        content: 'Customer mentioned they prefer email communication over phone calls due to work schedule.'
      }
    },
    {
      id: '3',
      type: 'task',
      title: 'Task completed',
      description: 'Send product information',
      timestamp: '2023-10-13T09:45:00Z',
      user: 'John Agent',
      metadata: {
        taskName: 'Send product information',
        status: 'completed'
      }
    }
  ];
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!contact) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Contact not found
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ContactDetailHeader contact={contact} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ContactTabs 
            contact={contact} 
            contactId={contact.id} 
            contactName={`${contact.firstname} ${contact.lastname}`}
          />
        </div>
        
        <ContactSidebar contact={contact} />
      </div>
    </div>
  );
};

export default ContactDetail;
