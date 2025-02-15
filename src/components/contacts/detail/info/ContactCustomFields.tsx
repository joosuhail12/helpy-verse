
import { Contact } from '@/types/contact';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomFields } from '@/hooks/useCustomFields';

interface ContactCustomFieldsProps {
  contact: Contact;
}

export const ContactCustomFields = ({ contact }: ContactCustomFieldsProps) => {
  const { data: customFields, isLoading } = useCustomFields('contacts');

  if (!customFields?.contacts || customFields.contacts.length === 0) {
    return null;
  }

  return (
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
  );
};

