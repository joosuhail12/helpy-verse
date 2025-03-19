
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Building, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ContactTags } from './ContactTags';
import { CustomerSentiment } from './CustomerSentiment';
import { Contact } from '@/types/contact';

interface ContactSidebarProps {
  contact: Contact;
}

export const ContactSidebar: React.FC<ContactSidebarProps> = ({ contact }) => {
  const fullName = `${contact.firstname} ${contact.lastname}`;
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={contact.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`} 
                alt={fullName}
              />
              <AvatarFallback>
                {contact.firstname?.[0]}{contact.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{fullName}</h3>
              <p className="text-sm text-muted-foreground">{contact.jobTitle || 'No title'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>
                  {typeof contact.company === 'object' ? contact.company.name : contact.company}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created: {formatDate(contact.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ContactTags 
        contact={contact}
        contactId={contact.id}
      />
      
      <CustomerSentiment
        contactId={contact.id}
      />
    </div>
  );
};
