
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact } from '@/types/contact';
import { Activity } from '@/types/activity';
import { ContactBasicInfo } from './info/ContactBasicInfo';
import { ContactCommunicationInfo } from './info/ContactCommunicationInfo';
import { ContactCompanyInfo } from './info/ContactCompanyInfo';
import { ContactAddress } from './ContactAddress';
import { ContactSocialLinks } from './ContactSocialLinks';
import { ContactPreferences } from './info/ContactPreferences';
import { ContactDatesInfo } from './info/ContactDatesInfo';
import { ContactCustomFields } from './info/ContactCustomFields';
import { ContactStatusInfo } from './info/ContactStatusInfo';
import { ContactTags } from './ContactTags';

interface ContactInformationProps {
  contact: Contact;
  activities: Activity[];
}

export const ContactInformation: React.FC<ContactInformationProps> = ({ 
  contact,
  activities 
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactBasicInfo contact={contact} />
            <ContactCommunicationInfo contact={contact} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactCompanyInfo contact={contact} />
            <ContactStatusInfo contact={contact} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactAddress contact={contact} />
            <ContactTags contactId={contact.id} contact={contact} />
          </div>
        </TabsContent>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactBasicInfo contact={contact} />
            <ContactDatesInfo contact={contact} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactCompanyInfo contact={contact} />
            <ContactSocialLinks contact={contact} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactAddress contact={contact} />
            <ContactStatusInfo contact={contact} />
          </div>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <ContactPreferences contact={contact} />
        </TabsContent>
        
        {/* Custom Fields Tab */}
        <TabsContent value="custom" className="space-y-6">
          <ContactCustomFields contact={contact} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
