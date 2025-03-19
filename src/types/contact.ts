
export interface Contact {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatar?: string;
  jobTitle?: string;
  title?: string;
  department?: string;
  company?: string | { id: string; name: string } | null;
  status: 'active' | 'inactive';
  type: 'customer' | 'visitor';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  lastContacted?: string;
  lastActivity?: string;
  notes?: {
    id: string;
    content: string;
    createdAt: string;
    createdBy?: string;
  }[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  // Address fields directly on contact
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Social media
  linkedinUrl?: string;
  twitterUrl?: string;
  // User preferences
  timezone?: string;
  source?: string;
  language?: string;
  preferredLanguage?: string;
  // Additional fields
  assignedTo?: string;
  accountValue?: number;
  customFields?: Record<string, any>;
}

export interface ContactTimelineProps {
  contact: Contact;
}

export interface ContactTagsProps {
  contact: Contact;
  contactId: string;
}

export interface ContactInformationProps {
  contact: Contact;
  activities: Activity[];
}

export interface ContactNotesProps {
  contact: Contact;
  currentUser: string;
}

export interface CustomerSentimentProps {
  activities: Activity[];
}

export interface ContactCompanyInfoProps {
  contact: Contact;
}

export interface QuickNoteInputProps {
  contactId: string;
  onAddNote?: (note: string) => void;
}

// Import Activity type
import { Activity } from './activity';
