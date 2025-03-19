import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, User, Building } from 'lucide-react';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchContactById } from '@/store/slices/contacts/contactsSlice';
import { ContactDetailSidebar } from '@/components/contacts/detail/ContactDetailSidebar';
import { ContactInformation } from '@/components/contacts/detail/ContactInformation';
import { Activity } from '@/types/activity';
import { ContactTickets } from '@/components/contacts/detail/ContactTickets';

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'email',
    subject: 'Welcome Email',
    content: 'Welcome to our platform!',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'note',
    subject: 'Note from John',
    content: 'Talked to the contact, seems interested.',
    createdAt: new Date().toISOString(),
  },
];

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { contacts } = useAppSelector(state => state.contacts);
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Check if contact is already in the store
      const existingContact = contacts.find(c => c.id === id);
      if (existingContact) {
        setContact(existingContact);
      } else {
        // Fetch contact if not in the store
        dispatch(fetchContactById(id))
          .then((result: any) => {
            setContact(result.payload);
          })
          .catch(error => {
            console.error("Failed to fetch contact:", error);
          });
      }
    }
  }, [id, dispatch, contacts]);

  if (!contact) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{contact.firstname} {contact.lastname}</h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(contact.createdAt), 'PPP')}
          </p>
        </div>
        <Button>Edit Contact</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://avatar.vercel.sh/${contact.email}.png`} />
                  <AvatarFallback>{contact.firstname?.[0]}{contact.lastname?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{contact.firstname} {contact.lastname}</div>
                  <div className="text-sm text-muted-foreground">{contact.title}</div>
                  <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                      <Building className="h-4 w-4" />
                      <span>{typeof contact.company === 'string' ? contact.company : contact.company.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <ContactInformation contact={contact} activities={mockActivities} />

          <ContactTickets contactId={contact.id} />
        </div>

        <ContactDetailSidebar contact={contact} />
      </div>
    </div>
  );
};

export default Detail;
