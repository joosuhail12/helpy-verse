
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';
import { updateContactCompany } from '@/store/slices/contacts/contactsActions';
import { selectContacts, selectContactsLoading } from '@/store/slices/contacts/contactsSelectors';
import { Contact } from '@/types/contact';
import { useDebounce } from '@/hooks/useDebounce';

export const useAssociatedContacts = (companyId: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [associatedContacts, setAssociatedContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const contacts = useAppSelector(selectContacts);
  const loading = useAppSelector(selectContactsLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchCustomers())
      .unwrap()
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const fetchAssociatedContacts = () => {
    const associated = contacts.filter(contact => contact.company === companyId);
    setAssociatedContacts(associated);

    const available = contacts.filter(contact => !contact.company);
    setAvailableContacts(available);
  };

  useEffect(() => {
    if (contacts.length > 0) {
      fetchAssociatedContacts();
    }
  }, [contacts, companyId]);

  const filteredContacts = availableContacts.filter(contact => {
    const firstName = contact.firstname.toLowerCase();
    const lastName = contact.lastname.toLowerCase();
    const email = contact.email.toLowerCase();
    const query = debouncedSearchQuery.toLowerCase();
    
    return firstName.includes(query) || lastName.includes(query) || email.includes(query);
  });

  const handleAssociateContact = (contactId: string) => {
    dispatch(
      updateContactCompany({
        contactId,
        companyId
      })
    );
    
    // Refresh associated contacts
    fetchAssociatedContacts();
    
    // Close popover
    setIsPopoverOpen(false);
    // Clear search query
    setSearchQuery('');
  };

  const handleRemoveAssociation = (contactId: string) => {
    dispatch(
      updateContactCompany({
        contactId,
        companyId: null
      })
    );
    fetchAssociatedContacts();
  };

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    associatedContacts,
    availableContacts,
    isPopoverOpen,
    setIsPopoverOpen,
    isLoading,
    loading,
    filteredContacts,
    handleAssociateContact,
    handleRemoveAssociation
  };
};
