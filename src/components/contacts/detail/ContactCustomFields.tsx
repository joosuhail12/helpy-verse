
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
  const { data, isLoading } = useCustomFields('contacts');

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

  if (!data?.contacts?.length) {
    return null;
  }

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {data.contacts.map((field) => (
            <div key={field.id} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
              <p className="text-sm">-</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
