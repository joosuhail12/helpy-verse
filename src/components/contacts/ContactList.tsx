
import React from 'react';
import { ContactListItem } from './ContactListItem';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Contact } from '@/types/contact';
import { selectSelectedContactIds } from '@/store/slices/contacts/contactsSelectors';

interface ContactListPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

interface ContactListProps {
  contacts: Contact[];
}

export const ContactList: React.FC<ContactListProps> = ({ contacts }) => {
  const selectedContactIds = useAppSelector(selectSelectedContactIds);

  return (
    <div className="bg-white rounded-md shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  // Implement all-selection functionality here
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Activity</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                isSelected={selectedContactIds.includes(contact.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* Will implement ContactListPagination implementation later */}
    </div>
  );
};
