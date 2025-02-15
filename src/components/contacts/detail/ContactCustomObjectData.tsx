
import { Contact } from '@/types/contact';
import { mockCustomObjects } from '@/mock/customObjects';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface ContactCustomObjectDataProps {
  contact: Contact;
}

export const ContactCustomObjectData = ({ contact }: ContactCustomObjectDataProps) => {
  // Filter custom objects that are connected with customers
  const customerObjects = mockCustomObjects.filter(
    obj => obj.connectionType === 'customer' && obj.showInCustomerDetail
  );

  if (customerObjects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {customerObjects.map((obj) => (
        <Card key={obj.id} className="bg-white">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">{obj.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {obj.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {field.name}
                  </p>
                  <p className="text-sm py-1 px-2">-</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

