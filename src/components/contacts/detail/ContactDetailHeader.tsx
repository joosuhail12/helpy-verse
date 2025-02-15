
import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ContactDetailHeaderProps {
  contact: Contact;
}

export const ContactDetailHeader = ({ contact }: ContactDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="border-b pb-6">
      <div className="flex items-start justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home/contacts/all')}
          className="mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{contact.email}</p>
        </div>
      </div>
    </div>
  );
};

