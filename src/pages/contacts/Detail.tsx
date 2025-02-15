
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ContactDetailHeader } from '@/components/contacts/detail/ContactDetailHeader';
import { ContactBasicInfo } from '@/components/contacts/detail/ContactBasicInfo';
import { ContactCustomFields } from '@/components/contacts/detail/ContactCustomFields';
import { Card } from '@/components/ui/card';

const ContactDetail = () => {
  const { id } = useParams();
  const contact = useAppSelector((state) => 
    state.contacts.contacts.find((c) => c.id === id)
  );

  if (!contact) {
    return (
      <div className="p-6">
        <Card className="p-4 text-red-500">
          Contact not found
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <ContactDetailHeader contact={contact} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <ContactBasicInfo contact={contact} />
        <ContactCustomFields contact={contact} />
      </div>
    </div>
  );
};

export default ContactDetail;
