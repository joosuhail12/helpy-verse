
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Users2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ContactRelatedProps {
  contact: Contact;
}

export const ContactRelated = ({ contact }: ContactRelatedProps) => {
  const allContacts = useAppSelector((state) => state.contacts.contacts);
  
  if (!contact.company) return null;

  // Find colleagues (same company, excluding self)
  const colleagues = allContacts.filter(c => 
    c.company === contact.company && 
    c.id !== contact.id
  );

  if (colleagues.length === 0) return null;

  return (
    <Card className="mt-4 bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5 transition-all duration-300 hover:shadow-purple-500/10">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Related Contacts</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70 mb-3">
            <Users2 className="h-4 w-4" />
            <span>Colleagues at {contact.company}</span>
          </div>
          <div className="space-y-3">
            {colleagues.map((colleague) => (
              <div key={colleague.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{colleague.firstName} {colleague.lastName}</p>
                  <p className="text-xs text-muted-foreground">{colleague.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

