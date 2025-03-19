
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { formatPhoneNumber } from '@/utils/formatters';
import { Checkbox } from '@/components/ui/checkbox';
import type { Contact } from '@/types/contact';
import { CheckCircle2, Clock, Mail, Phone } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectContact, toggleContactSelection } from '@/store/slices/contacts/contactsSlice';

export interface ContactListItemProps {
  contact: Contact;
  onClick?: () => void;
}

export const ContactListItem: React.FC<ContactListItemProps> = ({ contact, onClick }) => {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.contacts.selectedIds);
  const allTags = useAppSelector((state) => state.tags?.tags || []);
  
  const isSelected = selectedIds.includes(contact.id);
  
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleContactSelection(contact.id));
  };
  
  const handleSelectContact = () => {
    dispatch(selectContact(contact.id));
    if (onClick) onClick();
  };

  const displayName = `${contact.firstname} ${contact.lastname}`;
  const companyName = typeof contact.company === 'string' 
    ? contact.company 
    : contact.company?.name || '';
  
  // Filter to only get tags that match this contact's tag ids
  const contactTags = (contact.tags || []).map(tagId => {
    return allTags.find(tag => tag.id === tagId) || { id: tagId, name: tagId, color: 'gray' };
  });

  return (
    <div
      className="flex items-center p-4 hover:bg-muted cursor-pointer border-b"
      onClick={handleSelectContact}
    >
      <div className="mr-4" onClick={handleSelect}>
        <Checkbox checked={isSelected} />
      </div>
      
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} />
          <AvatarFallback>{`${contact.firstname[0]}${contact.lastname[0]}`}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="font-medium truncate">{displayName}</p>
            {contact.status === 'active' && (
              <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {contactTags.slice(0, 3).map(tag => (
              <Badge key={tag.id} variant="outline" className="text-xs px-1" style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}>
                {tag.name}
              </Badge>
            ))}
            {contactTags.length > 3 && (
              <Badge variant="outline" className="text-xs px-1">+{contactTags.length - 3}</Badge>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-end text-sm">
          <div className="flex items-center text-muted-foreground">
            <Mail className="h-4 w-4 mr-1" />
            <span className="hidden lg:inline">{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center text-muted-foreground mt-1">
              <Phone className="h-4 w-4 mr-1" />
              <span className="hidden lg:inline">{formatPhoneNumber(contact.phone)}</span>
            </div>
          )}
        </div>
        
        <div className="ml-4 text-right hidden sm:block">
          <div className="text-sm text-muted-foreground">{companyName}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {contact.lastActivity ? format(new Date(contact.lastActivity), 'MMM d, yyyy') : 'No activity'}
          </div>
        </div>
      </div>
    </div>
  );
};
