
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
    <div className="border-b border-purple-100/20 pb-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home/contacts/all')}
          className="mt-1 hover:bg-purple-50/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-purple-600" />
        </Button>
      </div>
      
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 ring-4 ring-purple-100/50 transition-transform duration-300 hover:scale-105">
          <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
          <AvatarFallback className="bg-gradient-to-br from-purple-500/10 to-purple-600/20">
            <User className="h-8 w-8 text-purple-600" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-sm text-purple-600/70 mt-1">{contact.email}</p>
        </div>
      </div>
    </div>
  );
};
