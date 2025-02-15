
import { Contact } from '@/types/contact';
import { useCustomFields } from '@/hooks/useCustomFields';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactCustomFieldsProps {
  contact: Contact;
}

export const ContactCustomFields = ({ contact }: ContactCustomFieldsProps) => {
  const { data: customFields, isLoading } = useCustomFields('contacts');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
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
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {customFields.contacts.map((field) => (
          <div key={field.id}>
            <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
            <p className="mt-1">-</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
