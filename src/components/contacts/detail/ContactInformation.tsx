
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
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from '@/types/activity';
import { useCustomFields } from '@/hooks/useCustomFields';
import { Smile, Meh, Frown } from 'lucide-react';

interface ContactInformationProps {
  contact: Contact;
  activities: Activity[];
}

export const ContactInformation = ({ contact, activities }: ContactInformationProps) => {
  const { data: customFields, isLoading } = useCustomFields('contacts');

  // Calculate sentiment based on recent activities
  const calculateSentiment = () => {
    const recentActivities = activities.slice(0, 5);
    let positiveCount = 0;
    let negativeCount = 0;

    recentActivities.forEach(activity => {
      if (activity.metadata?.category === 'positive') positiveCount++;
      if (activity.metadata?.category === 'negative') negativeCount++;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const sentiment = calculateSentiment();

  return (
    <Card className="bg-white">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Badge 
              variant={contact.type === 'customer' ? 'default' : 'secondary'}
              className="mt-1 text-xs font-medium"
            >
              {contact.type}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge 
              variant={contact.status === 'active' ? 'default' : 'destructive'}
              className="mt-1 text-xs font-medium"
            >
              {contact.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <p className="text-sm font-medium text-muted-foreground">Customer Sentiment</p>
            <div className="flex items-center gap-2 py-1">
              {sentiment === 'positive' && (
                <Smile className="h-5 w-5 text-green-500" />
              )}
              {sentiment === 'neutral' && (
                <Meh className="h-5 w-5 text-yellow-500" />
              )}
              {sentiment === 'negative' && (
                <Frown className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm capitalize">{sentiment}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-sm py-1 px-2">
              {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
            <p className="text-sm py-1 px-2">
              {contact.lastContacted 
                ? format(new Date(contact.lastContacted), 'MMM dd, yyyy')
                : '-'}
            </p>
          </div>
        </div>

        {customFields?.contacts && customFields.contacts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </>
            ) : (
              customFields.contacts.map((field) => (
                <div key={field.id} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
                  <p className="text-sm py-1 px-2">-</p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

