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
import useCustomer from "@/hooks/use-customer";

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

  // Get customer details from Redux store using either ID or legacy customer identifier
  const { contactDetails, loading, error } = useAppSelector(
    (state: RootState) => state.contacts || {
      contactDetails: null,
      loading: false,
      error: null
    }
  );

  // Use our customer hook if customerId is available
  const { customer: customerFromCache, isLoading: isCustomerLoading } = useCustomer(ticket.customerId);

  // Initial state for collapsible sections
  const [openSections, setOpenSections] = useState({
    [PanelSection.TICKET]: true,
    [PanelSection.CONTACT]: true,
    [PanelSection.COMPANY]: true,
    [PanelSection.TIMELINE]: false
  });

  // Fetch customer details when ticket changes - only if customerId is not available
  useEffect(() => {
    if (!ticket.customerId && ticket?.customer) {
      dispatch(fetchCustomerDetails(ticket.customer));
    }
  }, [dispatch, ticket?.customer, ticket.customerId]);

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

  // Get final customer data (prioritize data from our cache if available)
  const customerData = ticket.customerId ? customerFromCache : contactDetails;
  const isLoadingCustomer = ticket.customerId ? isCustomerLoading : loading;

  // Memoize formatted customer data to prevent unnecessary recalculations
  const formattedCustomerData = useMemo(() => {
    if (!customerData) return null;

    return {
      id: customerData.id,
      name: `${customerData.firstname} ${customerData.lastname}`,
      firstName: customerData.firstname,
      lastName: customerData.lastname,
      email: customerData.email,
      phone: customerData.phone,
      company: customerData.company,
      title: customerData.title,
      department: customerData.department,
      timezone: customerData.timezone,
      linkedin: customerData.linkedinUrl,
      twitter: customerData.twitterUrl,
      language: customerData.language,
      accountValue: customerData.accountValue,
      status: customerData.status,
      type: customerData.type,
      source: customerData.source,
      createdAt: customerData.createdAt,
      updatedAt: customerData.updatedAt,
      address: {
        street: customerData.street,
        city: customerData.city,
        state: customerData.state,
        postalCode: customerData.postalCode,
        country: customerData.country
      }
    };
  }, [customerData]);

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
    if (customerData?.id) {
      dispatch(updateCustomer({
        customer_id: customerData.id,
        ...updates
      }));
    }
  };

  // Determine company information with proper fallback
  const companyInfo = useMemo(() => {
    return customerData?.company || ticket.company || null;
  }, [customerData, ticket.company]);

  // Loading indicator for header
  const customerDisplayName = isLoadingCustomer
    ? 'Loading...'
    : formattedCustomerData?.name || ticket.customer || 'Unknown Customer';

  return (
    <Card className="h-full flex flex-col bg-white border-l">
      <CustomerHeader
        customer={customerDisplayName}
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
            isLoading={isLoadingCustomer}
          />

          <CompanyInfoCard
            company={companyInfo ? {
              id: 'company-id',
              name: companyInfo,
              status: 'active',
              tierLevel: 'platinum',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            } : null}
            isOpen={openSections[PanelSection.COMPANY]}
            onToggle={() => toggleSection(PanelSection.COMPANY)}
          />

          <TimelineCard
            events={customerTimeline}
            isLoading={isLoadingCustomer}
            isOpen={openSections[PanelSection.TIMELINE]}
            onToggle={() => toggleSection(PanelSection.TIMELINE)}
          />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CustomerContextPanel;