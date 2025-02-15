
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { InlineEditField } from './InlineEditField';

interface ContactBasicInfoProps {
  contact: Contact;
}

export const ContactBasicInfo = ({ contact }: ContactBasicInfoProps) => {
  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1 group">
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Badge 
              variant={contact.type === 'customer' ? 'default' : 'secondary'}
              className="mt-1 text-xs font-medium"
            >
              {contact.type}
            </Badge>
          </div>
          <div className="space-y-1 group">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge 
              variant={contact.status === 'active' ? 'default' : 'destructive'}
              className="mt-1 text-xs font-medium"
            >
              {contact.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">First Name</p>
            <InlineEditField
              value={contact.firstName}
              contactId={contact.id}
              field="firstName"
              label="First Name"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Last Name</p>
            <InlineEditField
              value={contact.lastName}
              contactId={contact.id}
              field="lastName"
              label="Last Name"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <InlineEditField
              value={contact.email}
              contactId={contact.id}
              field="email"
              label="Email"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <InlineEditField
              value={contact.phone || ''}
              contactId={contact.id}
              field="phone"
              label="Phone"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <InlineEditField
              value={contact.company || ''}
              contactId={contact.id}
              field="company"
              label="Company"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-sm">{format(new Date(contact.createdAt), 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
            <p className="text-sm">
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
