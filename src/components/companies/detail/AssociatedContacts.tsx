
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactSearchPopover from './associatedContacts/ContactSearchPopover';
import ContactsTable from './associatedContacts/ContactsTable';
import EmptyContactsState from './associatedContacts/EmptyContactsState';
import LoadingState from './associatedContacts/LoadingState';
import { useAssociatedContacts } from './associatedContacts/useAssociatedContacts';

interface AssociatedContactsProps {
  companyId: string;
}

const AssociatedContacts: React.FC<AssociatedContactsProps> = ({ companyId }) => {
  const {
    searchQuery,
    setSearchQuery,
    associatedContacts,
    isPopoverOpen,
    setIsPopoverOpen,
    isLoading,
    loading,
    filteredContacts,
    handleAssociateContact,
    handleRemoveAssociation
  } = useAssociatedContacts(companyId);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Associated Contacts
        </CardTitle>
        <ContactSearchPopover
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredContacts={filteredContacts}
          onAssociateContact={handleAssociateContact}
        />
      </CardHeader>

      <CardContent>
        {associatedContacts.length === 0 ? (
          <EmptyContactsState 
            isPopoverOpen={isPopoverOpen} 
            setIsPopoverOpen={setIsPopoverOpen} 
          />
        ) : (
          <ContactsTable 
            contacts={associatedContacts} 
            onRemoveAssociation={handleRemoveAssociation} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AssociatedContacts;
