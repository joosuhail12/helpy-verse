
// Re-export all contact actions
export * from './contactsCore';
export * from './contactsFetch';
export * from './contactsManage';

// Export the RTK Query hooks for backward compatibility
export { 
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useUpdateContactCompanyMutation
} from '@/api/services/contactsApi';
