
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Contact } from '@/types/contact';

interface ContactRelatedProps {
  contact: Contact;
}

export const ContactRelated = ({ contact }: ContactRelatedProps) => {
  const navigate = useNavigate();
  const contacts = useAppSelector((state) => state.contacts?.contacts || []);

  // Get company ID if available
  const companyId = typeof contact.company === 'object' 
    ? contact.company?.id 
    : (contact.company || null);

  // Find related contacts (those from the same company)
  const relatedContacts = companyId 
    ? contacts.filter(c => 
        c.id !== contact.id && (
          (typeof c.company === 'object' && c.company?.id === companyId) ||
          (typeof c.company === 'string' && c.company === companyId)
        )
      )
    : [];

  if (relatedContacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No related contacts found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedContacts.slice(0, 5).map((relatedContact) => (
            <div key={relatedContact.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {relatedContact.firstname.charAt(0)}{relatedContact.lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {relatedContact.firstname} {relatedContact.lastname}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {relatedContact.title || relatedContact.email}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/home/contacts/detail/${relatedContact.id}`)}
              >
                View
              </Button>
            </div>
          ))}
          
          {relatedContacts.length > 5 && (
            <div className="text-center pt-2">
              <Button 
                variant="link"
                onClick={() => {
                  if (typeof contact.company === 'object') {
                    navigate(`/home/contacts/companies/${contact.company.id}`);
                  }
                }}
              >
                View all ({relatedContacts.length}) related contacts
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
