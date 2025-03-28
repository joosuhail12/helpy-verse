
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Contact } from '@/types/contact';
import { selectAllContacts } from '@/store/slices/contacts/contactsSelectors';
import { updateContactCompany } from '@/store/slices/contacts/actions/contactsManage';

export const useAssociatedContacts = (companyId: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const allContacts = useAppSelector(selectAllContacts);
  
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
    setLoading(true);
    try {
      await dispatch(updateContactCompany({ contactId, companyId }));
      setIsPopoverOpen(false);
    } catch (error) {
      console.error('Failed to associate contact:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveAssociation = async (contactId: string) => {
    setLoading(true);
    try {
      await dispatch(updateContactCompany({ contactId, companyId: null }));
    } catch (error) {
      console.error('Failed to remove association:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
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
  };
};
