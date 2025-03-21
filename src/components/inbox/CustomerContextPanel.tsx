import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { Ticket as TicketType } from "@/types/ticket";
import { useEffect, useState, useMemo } from "react";
import CustomerHeader from './components/CustomerHeader';
import CurrentTicketCard from './components/CurrentTicketCard';
import ContactInfoCard from './components/ContactInfoCard';
import CompanyInfoCard from './components/CompanyInfoCard';
import TimelineCard from './components/TimelineCard';
import { fetchCustomerDetails, updateCustomer } from "@/store/slices/contacts/contactsSlice";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Contact } from "@/types/contact";

interface CustomerContextPanelProps {
  ticket: TicketType;
}

// Enum for panel sections to avoid magic strings
enum PanelSection {
  TICKET = 'ticket',
  CONTACT = 'contact',
  COMPANY = 'company',
  TIMELINE = 'timeline'
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  const dispatch = useAppDispatch();

  // Get customer details from Redux store
  const { contactDetails, loading, error } = useAppSelector(
    (state: RootState) => state.contacts || {
      contactDetails: null,
      loading: false,
      error: null
    }
  );

  // Initial state for collapsible sections
  const [openSections, setOpenSections] = useState({
    [PanelSection.TICKET]: true,
    [PanelSection.CONTACT]: true,
    [PanelSection.COMPANY]: true,
    [PanelSection.TIMELINE]: false
  });

  // Fetch customer details when ticket changes
  useEffect(() => {
    if (ticket?.customer) {
      dispatch(fetchCustomerDetails(ticket.customer));
    }
  }, [dispatch, ticket?.customer]);

  // Log errors if any
  useEffect(() => {
    if (error) {
      console.error('Error fetching customer details:', error);
    }
  }, [error]);

  // Toggle section visibility
  const toggleSection = (section: PanelSection) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Memoize formatted customer data to prevent unnecessary recalculations
  const formattedCustomerData = useMemo(() => {
    if (!contactDetails) return null;

    return {
      id: contactDetails.id,
      name: `${contactDetails.firstname} ${contactDetails.lastname}`,
      firstName: contactDetails.firstname,
      lastName: contactDetails.lastname,
      email: contactDetails.email,
      phone: contactDetails.phone,
      company: contactDetails.company,
      title: contactDetails.title,
      department: contactDetails.department,
      timezone: contactDetails.timezone,
      linkedin: contactDetails.linkedinUrl,
      twitter: contactDetails.twitterUrl,
      language: contactDetails.language,
      accountValue: contactDetails.accountValue,
      status: contactDetails.status,
      type: contactDetails.type,
      source: contactDetails.source,
      createdAt: contactDetails.createdAt,
      updatedAt: contactDetails.updatedAt,
      address: {
        street: contactDetails.street,
        city: contactDetails.city,
        state: contactDetails.state,
        postalCode: contactDetails.postalCode,
        country: contactDetails.country
      }
    };
  }, [contactDetails]);

  // Sample timeline data - in a real app, this would come from an API
  const customerTimeline = [
    {
      id: '1',
      type: 'ticket' as const,
      description: 'Opened new ticket: Cannot access account',
      timestamp: '2024-03-10T10:00:00Z'
    },
    {
      id: '2',
      type: 'purchase' as const,
      description: 'Purchased Premium Plan',
      timestamp: '2024-03-08T15:30:00Z'
    },
    {
      id: '3',
      type: 'feedback' as const,
      description: 'Left positive feedback on support interaction',
      timestamp: '2024-03-05T09:15:00Z',
      sentiment: 'positive' as const
    }
  ];

  // Handler for updating customer information
  const handleUpdateCustomer = (updates: Partial<Contact>) => {
    if (contactDetails?.id) {
      dispatch(updateCustomer({
        customer_id: contactDetails.id,
        ...updates
      }));
    }
  };

  // Determine company information with proper fallback
  const companyInfo = useMemo(() => {
    return contactDetails?.company || ticket.company || null;
  }, [contactDetails, ticket]);

  return (
    <Card className="h-full flex flex-col bg-white border-l">
      <CustomerHeader
        customer={formattedCustomerData?.name || 'Loading...'}
        company={companyInfo}
      />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <CurrentTicketCard
            ticket={ticket}
            isOpen={openSections[PanelSection.TICKET]}
            onToggle={() => toggleSection(PanelSection.TICKET)}
          />

          <ContactInfoCard
            customer={formattedCustomerData}
            company={companyInfo}
            isOpen={openSections[PanelSection.CONTACT]}
            onToggle={() => toggleSection(PanelSection.CONTACT)}
          // onUpdate={handleUpdateCustomer}
          />

          <CompanyInfoCard
            // company={formattedCustomerData.company}
            isOpen={openSections[PanelSection.COMPANY]}
            onToggle={() => toggleSection(PanelSection.COMPANY)}
          />

          <TimelineCard
            events={customerTimeline}
            isLoading={loading}
            isOpen={openSections[PanelSection.TIMELINE]}
            onToggle={() => toggleSection(PanelSection.TIMELINE)}
          />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CustomerContextPanel;