
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  jobTitle?: string;
  company?: string;
  status: 'active' | 'inactive';
  tags?: string[];
  createdAt: string;
  lastContacted?: string;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
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
  contactId: string;
}
