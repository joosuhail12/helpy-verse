
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerSentiment } from './CustomerSentiment';
import { ContactTags } from './ContactTags';
import { ContactCompanyInfo } from './ContactCompanyInfo';
import { ContactSocialLinks } from './ContactSocialLinks';
import { MostUsedInfo } from './MostUsedInfo';
import type { Contact } from '@/types/contact';

interface ContactSidebarProps {
  contact: Contact;
}

export const ContactSidebar = ({ contact }: ContactSidebarProps) => {
  return (
    <div className="w-[300px] p-6 space-y-6 border-l border-border">
      <CustomerSentiment contact={contact} />
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactTags contact={contact} />
        </CardContent>
      </Card>
      
      {contact.company && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Company</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactCompanyInfo company={contact.company} />
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactSocialLinks contact={contact} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Most Used</CardTitle>
        </CardHeader>
        <CardContent>
          <MostUsedInfo contactId={contact.id} />
        </CardContent>
      </Card>
    </div>
  );
};
