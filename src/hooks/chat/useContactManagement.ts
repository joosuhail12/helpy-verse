
import { useState, useEffect, useCallback } from 'react';
import { contactService } from '@/api/services/contactService';
import { sessionManager } from '@/utils/auth/sessionManager';

/**
 * Hook for managing contact state in the chat widget
 */
export const useContactManagement = (workspaceId: string) => {
  const [contactId, setContactId] = useState<string | null>(localStorage.getItem('contactId'));
  const [contactInfo, setContactInfo] = useState<{
    name?: string;
    email?: string;
    verified?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsContactInfo, setNeedsContactInfo] = useState(false);

  // Load contact info when contactId changes
  useEffect(() => {
    const loadContactInfo = async () => {
      if (!contactId || !workspaceId) {
        setNeedsContactInfo(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Try to load contact from server
        const contact = await contactService.getContact(contactId, workspaceId);
        
        if (contact) {
          setContactInfo({
            name: `${contact.firstname} ${contact.lastname}`,
            email: contact.email,
            verified: true,
          });
          setNeedsContactInfo(false);
        } else {
          // Contact not found, clear stored ID and show form
          localStorage.removeItem('contactId');
          setContactId(null);
          setNeedsContactInfo(true);
        }
      } catch (error) {
        console.error('Failed to load contact info:', error);
        setNeedsContactInfo(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactInfo();
  }, [contactId, workspaceId]);

  // Save contact info
  const saveContactInfo = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    try {
      const contact = await contactService.findOrCreateContact({
        workspace_id: workspaceId,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        phone: data.phone,
      });

      if (contact) {
        localStorage.setItem('contactId', contact.id);
        setContactId(contact.id);
        setContactInfo({
          name: `${contact.firstname} ${contact.lastname}`,
          email: contact.email,
          verified: true,
        });
        setNeedsContactInfo(false);
        
        // Update session with contact info
        sessionManager.updateActivity();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save contact info:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  // Skip contact info collection (for optional flows)
  const skipContactInfo = useCallback(() => {
    setNeedsContactInfo(false);
  }, []);

  return {
    contactId,
    contactInfo,
    isLoading,
    needsContactInfo,
    saveContactInfo,
    skipContactInfo,
  };
};
