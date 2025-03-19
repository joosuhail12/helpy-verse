
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, Calendar, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Contact } from '@/types/contact';
import { ContactTags } from './ContactTags';
import { CustomerSentiment } from './CustomerSentiment';
import { MostUsedInfo } from './MostUsedInfo';

interface ContactSidebarProps {
  contact: Contact;
}

export const ContactSidebar = ({ contact }: ContactSidebarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-full lg:w-80 space-y-4 p-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Contact Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Message</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Meeting</span>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="text-lg">{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">{contact.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{contact.jobTitle}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{contact.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ContactTags contact={contact} />
      <CustomerSentiment contact={contact} />
      <MostUsedInfo contact={contact} />
    </div>
  );
};
