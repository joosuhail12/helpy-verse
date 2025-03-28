
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectContactsByCompany } from '@/store/slices/contacts/contactsSlice';
import { Link } from 'react-router-dom';

interface ContactRelatedProps {
  contact: Contact;
}

export const ContactRelated: React.FC<ContactRelatedProps> = ({ contact }) => {
  const companyId = contact.company;
  const relatedContacts = useAppSelector(state => 
    companyId ? selectContactsByCompany(state, companyId) : []
  );
  
  // Filter out the current contact
  const otherContacts = relatedContacts.filter(c => c.id !== contact.id);
  
  if (otherContacts.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Related Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {otherContacts.slice(0, 5).map((relatedContact) => (
            <div key={relatedContact.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                {relatedContact.firstname.charAt(0)}
                {relatedContact.lastname.charAt(0)}
              </div>
              <div>
                <Link 
                  to={`/contacts/${relatedContact.id}`}
                  className="font-medium hover:underline"
                >
                  {relatedContact.firstname} {relatedContact.lastname}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {relatedContact.role || 'No role'}
                </div>
              </div>
            </div>
          ))}
          
          {otherContacts.length > 5 && (
            <div className="text-sm text-muted-foreground pt-2">
              {otherContacts.length - 5} more related contacts
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
