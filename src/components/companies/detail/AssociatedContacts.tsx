
import { useAppSelector } from '@/hooks/useAppSelector';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AssociatedContactsProps {
  company: Company;
}

export const AssociatedContacts = ({ company }: AssociatedContactsProps) => {
  const contacts = useAppSelector((state) => 
    state.contacts.contacts.filter(contact => contact.company === company.name)
  );

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
      <CardHeader className="border-b border-purple-100/20 pb-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold text-purple-900">Associated Contacts</CardTitle>
        <Button variant="outline" size="sm" className="text-purple-600 border-purple-200">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <User className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Contacts Yet</h3>
            <p className="text-sm text-gray-500">Start by adding contacts to this company.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {contact.firstName[0]}
                      {contact.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</p>
                    <p className="text-sm text-gray-500">{contact.title || 'No title'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
