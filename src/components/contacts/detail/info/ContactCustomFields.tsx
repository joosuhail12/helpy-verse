
import { Contact } from '@/types/contact';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomFields } from '@/hooks/useCustomFields';
import { InlineEditField } from '../InlineEditField';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface ContactCustomFieldsProps {
  contact: Contact;
}

export const ContactCustomFields = ({ contact }: ContactCustomFieldsProps) => {
  const { data: customFields, isLoading } = useCustomFields('contacts');

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

  if (!customFields?.contacts.length) {
    return null;
  }

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {customFields.contacts.map((field) => {
            // Safely convert field value to the expected types
            const fieldValue = contact[field.id];
            let safeValue = '';

            if (typeof fieldValue === 'string') {
              safeValue = fieldValue;
            } else if (typeof fieldValue === 'number') {
              safeValue = fieldValue.toString();
            } else if (typeof fieldValue === 'boolean') {
              safeValue = fieldValue ? 'Yes' : 'No';
            } else if (Array.isArray(fieldValue)) {
              safeValue = fieldValue.join(', ');
              let safeValue: string | number | boolean | string[] = '';

              if (typeof fieldValue === 'string' ||
                typeof fieldValue === 'number' ||
                typeof fieldValue === 'boolean' ||
                Array.isArray(fieldValue)) {
                safeValue = fieldValue;
              } else if (fieldValue === null || fieldValue === undefined) {
                safeValue = '';
              } else if (typeof fieldValue === 'object') {
                // Convert object to string representation
                safeValue = JSON.stringify(fieldValue);
              }

              // Convert type if needed
              const typeMapping: Record<string, "text" | "url" | "email" | "date" | "phone" | "select"> = {
                'text': 'text',
                'email': 'email',
                'phone': 'phone',
                'date': 'date',
                'select': 'select',
                'url': 'url',
                'number': 'text'  // Map number to text type for input
              };

              const mappedType = typeMapping[field.type] || 'text';

              return (
                <div key={field.id} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
                  <InlineEditField
                    value={safeValue}
                    contactId={contact.id}
                    field={field.id}
                    label={field.name}
                    type={mappedType}
                    options={field.options}
                    validation={field.validationRules}
                  />
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};
