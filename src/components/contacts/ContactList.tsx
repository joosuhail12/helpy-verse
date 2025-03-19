
import React, { useState, useEffect } from 'react';
import { ContactListPagination } from './ContactListPagination';
import { ContactListItem } from './ContactListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectAllContacts, deselectAllContacts, setCurrentPage, setItemsPerPage } from '@/store/slices/contacts/contactsSlice';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '@/types/contact';

export interface ContactListProps {
  searchQuery?: string;
  statusFilter?: string;
  tagFilter?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const ContactList: React.FC<ContactListProps> = ({
  searchQuery = '',
  statusFilter = 'all',
  tagFilter = '',
  sortField = 'lastActivity',
  sortDirection = 'desc',
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isAllSelected, setIsAllSelected] = useState(false);
  
  const {
    items: contacts,
    loading,
    error,
    selectedIds,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems
  } = useAppSelector((state) => state.contacts);

  // Filter contacts based on search query, status, and tags
  const filteredContacts = contacts.filter((contact) => {
    // Search filter
    const searchMatch = searchQuery
      ? `${contact.firstname} ${contact.lastname} ${contact.email}`.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Status filter
    const statusMatch = statusFilter === 'all' || contact.status === statusFilter;
    
    // Tag filter
    const tagMatch = !tagFilter || (contact.tags && contact.tags.includes(tagFilter));
    
    return searchMatch && statusMatch && tagMatch;
  });
  
  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    switch (sortField) {
      case 'name':
        valueA = `${a.firstname} ${a.lastname}`.toLowerCase();
        valueB = `${b.firstname} ${b.lastname}`.toLowerCase();
        break;
      case 'email':
        valueA = a.email.toLowerCase();
        valueB = b.email.toLowerCase();
        break;
      case 'company':
        valueA = typeof a.company === 'string' ? a.company.toLowerCase() : a.company?.name?.toLowerCase() || '';
        valueB = typeof b.company === 'string' ? b.company.toLowerCase() : b.company?.name?.toLowerCase() || '';
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'lastActivity':
      default:
        valueA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
        valueB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
    }
    
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return multiplier * (valueA > valueB ? 1 : valueA < valueB ? -1 : 0);
  });

  useEffect(() => {
    setIsAllSelected(
      filteredContacts.length > 0 && 
      filteredContacts.every(contact => selectedIds.includes(contact.id))
    );
  }, [filteredContacts, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      dispatch(selectAllContacts(filteredContacts.map(contact => contact.id)));
    } else {
      dispatch(deselectAllContacts());
    }
    setIsAllSelected(checked);
  };

  const handleContactClick = (contactId: string) => {
    navigate(`/home/contacts/${contactId}`);
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleItemsPerPageChange = (items: number) => {
    dispatch(setItemsPerPage(items));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b">
            <Skeleton className="h-4 w-4 mr-4" />
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="hidden md:block">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No contacts found. Try adjusting your filters or adding new contacts.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center p-2 bg-muted/50">
        <div className="ml-2 mr-4">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all contacts"
          />
        </div>
        <div className="text-sm font-medium">
          {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select all'}
        </div>
      </div>
      
      <div className="divide-y">
        {sortedContacts.map((contact: Contact) => (
          <ContactListItem 
            key={contact.id} 
            contact={contact} 
            onClick={() => handleContactClick(contact.id)} 
          />
        ))}
      </div>
      
      <ContactListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};
