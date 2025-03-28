
import { baseApi } from '../baseApi';
import type { Contact, ContactFilters } from '@/types/contact';
import { mockContacts } from '@/store/slices/contacts/mockData';

export type ContactsResponse = {
  data: Contact[];
  total: number;
};

export type ContactsQueryParams = Partial<ContactFilters> & { 
  page?: number; 
  limit?: number;
};

// Define the contacts API
export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contacts with filtering
    getContacts: builder.query<ContactsResponse, ContactsQueryParams>({
      query: (filters) => ({
        url: '/contacts',
        params: filters
      }),
      // For demo/mock purposes
      transformResponse: () => ({
        data: mockContacts,
        total: mockContacts.length
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Contacts' as const, id })),
              { type: 'Contacts', id: 'LIST' }
            ]
          : [{ type: 'Contacts', id: 'LIST' }]
    }),
    
    // Get contact by ID
    getContactById: builder.query<Contact, string>({
      query: (id) => `/contacts/${id}`,
      // For demo/mock purposes
      transformResponse: (_, __, arg) => {
        const contact = mockContacts.find(c => c.id === arg);
        if (!contact) {
          throw new Error('Contact not found');
        }
        return contact;
      },
      providesTags: (_, __, id) => [{ type: 'Contacts', id }]
    }),
    
    // Create new contact
    createContact: builder.mutation<Contact, Partial<Contact>>({
      query: (contact) => ({
        url: '/contacts',
        method: 'POST',
        body: contact
      }),
      // For demo/mock purposes
      transformResponse: (_, __, arg) => {
        return {
          id: Date.now().toString(),
          ...arg,
          firstname: arg.firstname || '',
          lastname: arg.lastname || '',
          email: arg.email || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Contact;
      },
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }]
    }),
    
    // Update contact
    updateContact: builder.mutation<Contact, { id: string, data: Partial<Contact> }>({
      query: ({ id, data }) => ({
        url: `/contacts/${id}`,
        method: 'PATCH',
        body: data
      }),
      // For demo/mock purposes
      transformResponse: (_, __, arg) => {
        const contact = mockContacts.find(c => c.id === arg.id);
        if (!contact) {
          throw new Error('Contact not found');
        }
        return {
          ...contact,
          ...arg.data,
          updatedAt: new Date().toISOString()
        };
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'Contacts', id },
        { type: 'Contacts', id: 'LIST' }
      ]
    }),
    
    // Delete contact
    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Contacts', id },
        { type: 'Contacts', id: 'LIST' }
      ]
    }),
    
    // Update contact's company
    updateContactCompany: builder.mutation<Contact, { contactId: string, companyId: string | null }>({
      query: ({ contactId, companyId }) => ({
        url: `/contacts/${contactId}/company`,
        method: 'PATCH',
        body: { companyId }
      }),
      // For demo/mock purposes
      transformResponse: (_, __, arg) => {
        const contact = mockContacts.find(c => c.id === arg.contactId);
        if (!contact) {
          throw new Error('Contact not found');
        }
        return {
          ...contact,
          company: arg.companyId,
          updatedAt: new Date().toISOString()
        };
      },
      invalidatesTags: (_, __, { contactId }) => [
        { type: 'Contacts', id: contactId },
        { type: 'Contacts', id: 'LIST' },
        { type: 'Companies', id: 'LIST' }
      ]
    })
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useUpdateContactCompanyMutation
} = contactsApi;
