
import { Contact } from '@/types/contact';
import { Activity } from '@/types/activity';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { ContactStatusInfo } from './info/ContactStatusInfo';
import { ContactBasicInfo } from './info/ContactBasicInfo';
import { ContactCommunicationInfo } from './info/ContactCommunicationInfo';
import { ContactCompanyInfo } from './info/ContactCompanyInfo';
import { ContactDatesInfo } from './info/ContactDatesInfo';
import { ContactCustomFields } from './info/ContactCustomFields';

interface ContactInformationProps {
  contact: Contact;
  activities: Activity[];
}

export const ContactInformation = ({ contact, activities }: ContactInformationProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <ContactStatusInfo contact={contact} />
        <ContactBasicInfo contact={contact} />
        <ContactCommunicationInfo contact={contact} />
        <ContactCompanyInfo contact={contact} activities={activities} />
        <ContactDatesInfo contact={contact} />
        <ContactCustomFields contact={contact} />
      </CardContent>
    </Card>
  );
};

