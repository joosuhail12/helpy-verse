
import { Company } from '@/types/company';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus } from 'lucide-react';

interface CompanyRelatedProps {
  company: Company;
}

export const CompanyRelated = ({ company }: CompanyRelatedProps) => {
  // Mock data - in a real app this would come from an API
  const relatedContacts = [
    { id: '1', name: 'Sarah Johnson', title: 'CEO', email: 'sarah@example.com' },
    { id: '2', name: 'Michael Thompson', title: 'CTO', email: 'michael@example.com' },
  ];

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Related Contacts</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {relatedContacts.length > 0 ? (
          <div className="space-y-4">
            {relatedContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.title}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No related contacts found</p>
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
