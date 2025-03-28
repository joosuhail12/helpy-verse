
import React from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '@/types/contact';
import { ContactActivityBadge } from './ContactActivityBadge';
import { MoreHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleSelectContact, selectSelectedContactIds } from '@/store/slices/contacts/contactsSlice';

interface ContactListItemProps {
  contact: Contact;
  isSelected: boolean;
}

export const ContactListItem: React.FC<ContactListItemProps> = ({ contact, isSelected }) => {
  const dispatch = useAppDispatch();
  const selectedContactIds = useAppSelector(selectSelectedContactIds);
  
  const handleToggleSelect = () => {
    dispatch(toggleSelectContact(contact.id));
  };
  
  return (
    <tr className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
      <td className="w-12 px-4 py-3">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={isSelected}
          onChange={handleToggleSelect}
        />
      </td>
      <td className="px-4 py-3">
        <Link to={`/contacts/${contact.id}`} className="font-medium text-blue-600 hover:text-blue-800">
          {contact.firstname} {contact.lastname}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{contact.company ? contact.company : '-'}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          {contact.status || 'Active'}
        </span>
      </td>
      <td className="px-4 py-3">
        <ContactActivityBadge date={contact.lastActivity || contact.updatedAt} />
      </td>
      <td className="w-12 px-4 py-3">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
};
