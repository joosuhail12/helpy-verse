
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import type { ContactCompanyInfoProps } from '@/types/contact';

export const ContactCompanyInfo = ({ contact }: ContactCompanyInfoProps) => {
  if (!contact.company) {
    return null;
  }

  const companyName = typeof contact.company === 'string' 
    ? contact.company 
    : contact.company.name;

  const companyId = typeof contact.company === 'string'
    ? undefined
    : contact.company.id;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Building className="h-4 w-4 mr-2" />
          Company
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium">{companyName}</p>
        {contact.title && <p className="text-sm text-muted-foreground">{contact.title}</p>}
        {contact.department && <p className="text-sm text-muted-foreground">{contact.department}</p>}
      </CardContent>
    </Card>
  );
};

export default ContactCompanyInfo;
