
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/contact';
import { ContactBasicInfo } from './info/ContactBasicInfo';
import { ContactCommunicationInfo } from './info/ContactCommunicationInfo';
import { ContactSocialInfo } from './info/ContactSocialInfo';
import { ContactStatusInfo } from './info/ContactStatusInfo';
import { ContactDatesInfo } from './info/ContactDatesInfo';
import { ContactTags } from './ContactTags';

interface ContactDetailSidebarProps {
  contact: Contact;
}

export const ContactDetailSidebar = ({ contact }: ContactDetailSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactBasicInfo contact={contact} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactCommunicationInfo contact={contact} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactStatusInfo contact={contact} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Social Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactSocialInfo contact={contact} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactDatesInfo contact={contact} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactTags contact={contact} tags={contact.tags || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" variant="outline">
            Send Email
          </Button>
          <Button className="w-full" variant="outline">
            Call Contact
          </Button>
          <Button className="w-full" variant="outline">
            Schedule Meeting
          </Button>
          <Button className="w-full" variant="destructive">
            Delete Contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
