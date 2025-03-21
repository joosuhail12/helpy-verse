
import { Contact } from '@/types/contact';
import { useCustomFields } from '@/hooks/useCustomFields';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineEditField } from '../InlineEditField';

interface ContactCustomFieldsProps {
  contact: Contact;
}

export const ContactCustomFields = ({ contact }: ContactCustomFieldsProps) => {
  // Change 'contacts' to 'contact' to match the expected enum values
  const { data: customFields, isLoading } = useCustomFields('contact');

  if (isLoading) {
    return (
      <Card className="border-none shadow-none bg-gray-50/50">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Custom Fields</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customFields?.length) {
    return null;
  }

  // Filter by customer entityType (either 'customer' or 'contact')
  const customerFields = customFields.filter(field => 
    field.entityType === 'customer' || field.entityType === 'contact');
  
  if (customerFields.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {customerFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
              <InlineEditField
                value={contact[field.id] as string | number | boolean | string[] || ''}
                contactId={contact.id}
                field={field.id}
                label={field.name}
                type={field.fieldType}
                options={field.options || []}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
