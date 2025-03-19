
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contact } from '@/types/contact';

interface ContactAddressProps {
  contact: Contact;
}

export const ContactAddress = ({ contact }: ContactAddressProps) => {
  const hasAddressData = contact.street || contact.city || contact.state || contact.postalCode || contact.country;

  if (!hasAddressData) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {contact.street && <p>{contact.street}</p>}
        <p>
          {contact.city && <span>{contact.city}, </span>}
          {contact.state && <span>{contact.state} </span>}
          {contact.postalCode && <span>{contact.postalCode}</span>}
        </p>
        {contact.country && <p>{contact.country}</p>}
      </CardContent>
    </Card>
  );
};

export default ContactAddress;
