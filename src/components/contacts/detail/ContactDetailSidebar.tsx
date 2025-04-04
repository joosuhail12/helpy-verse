
import React from 'react';
import { Contact } from '@/types/contact';
import { ContactTags } from './ContactTags';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Edit, Archive } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { updateContact } from '@/store/slices/contacts/contactsSlice';

interface ContactDetailSidebarProps {
  contact: Contact;
}

export const ContactDetailSidebar = ({ contact }: ContactDetailSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleArchive = () => {
    dispatch(updateContact({
      contactId: contact.id,
      data: { status: 'inactive' }
    }))
      .then(() => {
        navigate('/home/contacts/all');
      });
  };

  // Format the phone number if present
  const formattedPhone = contact.phone ? (
    <Button variant="link" className="p-0 h-auto font-normal text-blue-500" asChild>
      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
    </Button>
  ) : (
    <span className="text-gray-500 italic">No phone</span>
  );

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium">
              {contact.firstname?.[0]}{contact.lastname?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {contact.firstname} {contact.lastname}
              </h2>
              <p className="text-muted-foreground">
                {typeof contact.title === 'string' ? contact.title : 'No title'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Button variant="link" className="p-0 h-auto font-normal text-blue-500" asChild>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {formattedPhone}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <ContactTags contactId={contact.id} tags={contact.tags} />
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button variant="destructive" size="sm" className="w-full" onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
