
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
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5 transition-all duration-300 hover:shadow-purple-500/10">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
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
