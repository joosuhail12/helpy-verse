
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAllContacts } from '@/store/slices/contacts/contactsSelectors';
import { useUpdateContactCompanyMutation } from '@/api/services/contactsApi';

export const useAssociatedContacts = (companyId: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Get data from Redux store (will be replaced with RTK Query in future)
  const allContacts = useAppSelector(selectAllContacts);
  
  // Use RTK Query mutation for updating contacts
  const [updateContactCompany, { isLoading }] = useUpdateContactCompanyMutation();
  
  // Filter contacts associated with the company
  const associatedContacts = allContacts.filter(
    contact => contact.company === companyId
  );
  
  // Filter contacts for the search popover (those not already associated)
  const unassociatedContacts = allContacts.filter(
    contact => contact.company !== companyId
  );
  
  // Filter contacts based on search query
  const filteredContacts = searchQuery
    ? unassociatedContacts.filter(
        contact =>
          `${contact.firstname} ${contact.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : unassociatedContacts.slice(0, 5); // Just show first 5 if no search
  
  const handleAssociateContact = async (contactId: string) => {
    try {
      await updateContactCompany({ contactId, companyId }).unwrap();
      setIsPopoverOpen(false);
    } catch (error) {
      console.error('Failed to associate contact:', error);
    }
  };
  
  const handleRemoveAssociation = async (contactId: string) => {
    try {
      await updateContactCompany({ contactId, companyId: null }).unwrap();
    } catch (error) {
      console.error('Failed to remove association:', error);
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    associatedContacts,
    isPopoverOpen,
    setIsPopoverOpen,
    isLoading,
    loading: isLoading,
    filteredContacts,
    handleAssociateContact,
    handleRemoveAssociation
  };
};
