
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
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCustomFields } from '@/hooks/useCustomFields';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactBasicInfoProps {
  contact: Contact;
}

interface FieldGroupProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const FieldGroup = ({ title, defaultOpen = true, children }: FieldGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 group">
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        <h3 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{title}</h3>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const ContactBasicInfo = ({ contact }: ContactBasicInfoProps) => {
  const { data: customFields, isLoading } = useCustomFields('contacts');

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <FieldGroup title="Status Information">
          <div className="grid grid-cols-2 gap-4">
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
        </FieldGroup>

        <Separator className="my-4" />

        <FieldGroup title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
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
        </FieldGroup>

        <Separator className="my-4" />

        <FieldGroup title="Contact Information">
          <div className="grid grid-cols-2 gap-4">
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
        </FieldGroup>

        <Separator className="my-4" />

        <FieldGroup title="Company Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <InlineEditField
                value={contact.company || ''}
                contactId={contact.id}
                field="company"
                label="Company"
              />
            </div>
          </div>
        </FieldGroup>

        <Separator className="my-4" />

        <FieldGroup title="System Information">
          <div className="grid grid-cols-2 gap-4">
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
        </FieldGroup>

        {customFields?.contacts && customFields.contacts.length > 0 && (
          <>
            <Separator className="my-4" />
            <FieldGroup title="Custom Fields">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {customFields.contacts.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
                      <p className="text-sm py-1 px-2">-</p>
                    </div>
                  ))}
                </div>
              )}
            </FieldGroup>
          </>
        )}
      </CardContent>
    </Card>
  );
};
