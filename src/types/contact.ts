
export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  type: string;
  status: string;
  company?: {
    id: string;
    name: string;
  } | string;
  tags?: string[];
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties
  title?: string;
  department?: string;
  lastContacted?: string;
  timezone?: string;
  source?: string;
  language?: string;
  preferredLanguage?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  notes?: {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }[];
  accountValue?: number;
  assignedTo?: string;
}

export interface ContactCompanyInfoProps {
  contact: Contact;
}

export interface ContactTicketsProps {
  contactId: string;
  contactName?: string;
}

export interface QuickNoteInputProps {
  contact: Contact;
}

export interface ContactTagsProps {
  contactId: string;
}

export interface ContactListItemProps {
  contact: Contact;
  onClick?: () => void;
}
