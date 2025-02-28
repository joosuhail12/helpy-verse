
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Users } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/contacts/contactsSlice';

interface ContactsErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * A contacts-specific error boundary component that handles errors in the contacts feature.
 * Provides a custom fallback UI with contacts-specific actions.
 */
const ContactsErrorBoundary: React.FC<ContactsErrorBoundaryProps> = ({ children }) => {
  const ContactsFallbackComponent = ({ reset }: { error: Error | null; reset: () => void }) => {
    const dispatch = useAppDispatch();
    
    const handleRefreshData = () => {
      console.log("Refreshing contacts data...");
      dispatch(fetchCustomers());
      reset();
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-6 my-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Contacts</h3>
          <p className="text-gray-500 mb-6">
            We encountered a problem while loading your contacts. This could be due to a network issue or a temporary server problem.
          </p>
          <div className="flex space-x-4">
            <Button onClick={handleRefreshData}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={reset}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallbackComponent={ContactsFallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default ContactsErrorBoundary;
