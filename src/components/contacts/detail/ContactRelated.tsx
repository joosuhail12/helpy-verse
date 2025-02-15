
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ContactRelatedProps {
  contact: Contact;
}

export const ContactRelated = ({ contact }: ContactRelatedProps) => {
  // Mock related contacts data - this would come from your backend
  const relatedContacts = [
    {
      id: '2',
      name: 'Sarah Wilson',
      role: 'Marketing Manager',
      company: contact.company,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Sales Director',
      company: contact.company,
    },
  ];

  if (!contact.company) return null;

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Colleagues at {contact.company}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {relatedContacts.map((related) => (
            <div key={related.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{related.name}</p>
                <p className="text-xs text-muted-foreground">{related.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
