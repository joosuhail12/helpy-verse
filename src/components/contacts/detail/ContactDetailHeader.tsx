
import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactDetailHeaderProps {
  contact: Contact;
}

export const ContactDetailHeader = ({ contact }: ContactDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home/contacts/all')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">{contact.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
