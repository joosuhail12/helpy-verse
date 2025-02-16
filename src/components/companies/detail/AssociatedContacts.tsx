
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus, Search, Check } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface AssociatedContactsProps {
  company: Company;
}

export const AssociatedContacts = ({ company }: AssociatedContactsProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addContactSearch, setAddContactSearch] = useState('');

  // Get all contacts and filter for those associated with this company
  const contacts = useAppSelector((state) => 
    state.contacts.contacts.filter(contact => contact.company === company.name)
  );

  // Get all contacts not associated with this company for adding
  const availableContacts = useAppSelector((state) => 
    state.contacts.contacts.filter(contact => 
      contact.company !== company.name && 
      (
        contact.firstName.toLowerCase().includes(addContactSearch.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(addContactSearch.toLowerCase()) ||
        contact.email.toLowerCase().includes(addContactSearch.toLowerCase())
      )
    )
  );

  // Filter displayed contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = async (contact: Contact) => {
    try {
      dispatch(updateContact({ 
        id: contact.id,
        company: company.name,
        updatedAt: new Date().toISOString(),
      }));
      
      toast({
        title: "Contact added",
        description: `${contact.firstName} ${contact.lastName} has been added to ${company.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact to company",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
      <CardHeader className="border-b border-purple-100/20 pb-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold text-purple-900">Associated Contacts</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-purple-600 border-purple-200"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <User className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Contacts Found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search terms." : "Start by adding contacts to this company."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
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

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[475px]">
            <DialogHeader>
              <DialogTitle>Add Contact to {company.name}</DialogTitle>
            </DialogHeader>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Search contacts..."
                value={addContactSearch}
                onValueChange={setAddContactSearch}
              />
              <CommandEmpty>No contacts found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {availableContacts.map((contact) => (
                  <CommandItem
                    key={contact.id}
                    className="flex items-center justify-between py-2 px-2 cursor-pointer"
                    onSelect={() => {
                      handleAddContact(contact);
                      setShowAddDialog(false);
                      setAddContactSearch('');
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {contact.firstName[0]}
                          {contact.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                    <Check className="h-4 w-4 text-gray-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
