
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface ContactBasicInfoProps {
  contact: Contact;
}

export const ContactBasicInfo = ({ contact }: ContactBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Badge variant={contact.type === 'customer' ? 'default' : 'secondary'} className="mt-1">
              {contact.type}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={contact.status === 'active' ? 'default' : 'destructive'} className="mt-1">
              {contact.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <p className="mt-1">{contact.company || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p className="mt-1">{contact.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="mt-1">{format(new Date(contact.createdAt), 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
            <p className="mt-1">
              {contact.lastContacted 
                ? format(new Date(contact.lastContacted), 'MMM dd, yyyy')
                : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
