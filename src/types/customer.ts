export interface Customer {
    id: string;
    phone?: string;
    firstname: string;
    lastname: string;
    email: string;
    type?: string;
    title?: string;
    companyId?: string;
    department?: string;
    timezone?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    preferredLanguage?: string;
    source?: string;
    assignedTo?: string;
    accountValue?: number;
    tags?: {
        id: string;
        name: string;
    }[];
    notes?: string;
    lastContacted?: string;
    // Address fields
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    createdAt?: string;
    updatedAt?: string;
} 