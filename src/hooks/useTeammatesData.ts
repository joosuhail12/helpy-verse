
import { useState, useEffect } from 'react';
import type { Teammate } from '@/types/teammate';

// This hook fetches teammates data and manages loading & error states
export const useTeammatesData = () => {
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  // Simulating data fetching with setTimeout
  useEffect(() => {
    const fetchTeammates = async () => {
      try {
        setLoading(true);
        
        // Replace this with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with API response
        const mockTeammates: Teammate[] = [
          {
            id: '1',
            name: 'Jane Smith',
            email: 'jane@company.com',
            role: 'admin',
            status: 'active',
            lastActive: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'John Doe',
            email: 'john@company.com',
            role: 'agent',
            status: 'active',
            lastActive: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Alice Johnson',
            email: 'alice@company.com',
            role: 'supervisor',
            status: 'pending',
            lastActive: null,
          }
        ];
        
        setTeammates(mockTeammates);
        setError(null);
      } catch (err) {
        console.error('Error fetching teammates:', err);
        setError('Failed to load teammates. Please try again.');
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

    fetchTeammates();
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    setError(null);
    
    // Refetch data - this is just a simulation
    setTimeout(() => {
      setTeammates([
        {
          id: '1',
          name: 'Jane Smith',
          email: 'jane@company.com',
          role: 'admin',
          status: 'active',
          lastActive: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@company.com',
          role: 'agent',
          status: 'active',
          lastActive: new Date().toISOString(),
        }
      ]);
      setRetrying(false);
    }, 1500);
  };

  return {
    teammates,
    loading,
    error,
    retrying,
    handleRetry
  };
};
