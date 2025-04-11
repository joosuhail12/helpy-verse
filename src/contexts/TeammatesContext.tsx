import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HttpClient } from '@/api/services/HttpClient';
import { getUserId } from '@/utils/helpers/helpers';

interface Teammate {
    id: string;
    name: string;
    email: string;
}

interface TeammatesContextType {
    teammates: Teammate[];
    loading: boolean;
    error: string | null;
    fetchTeammates: () => Promise<void>;
    hasLoaded: boolean;
}

const TeammatesContext = createContext<TeammatesContextType | null>(null);

export const useTeammates = () => {
    const context = useContext(TeammatesContext);
    if (!context) {
        throw new Error('useTeammates must be used within a TeammatesProvider');
    }
    return context;
};

interface TeammatesProviderProps {
    children: ReactNode;
}

export const TeammatesProvider: React.FC<TeammatesProviderProps> = ({ children }) => {
    const [teammates, setTeammates] = useState<Teammate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchTeammates = async () => {
        if (loading || hasLoaded) return;

        try {
            setLoading(true);
            setError(null);

            const userId = getUserId();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            const response = await HttpClient.apiClient.get(`/team/user/${userId}/teammates`);

            if (response.data.status === 'success') {
                setTeammates(response.data.data);
                setHasLoaded(true);
            } else {
                setError('Failed to fetch teammates data');
            }
        } catch (err) {
            console.error('Error fetching teammates:', err);
            setError('Error connecting to the server');
        } finally {
            setLoading(false);
        }
    };

    // Value to be provided to consumers
    const value = {
        teammates,
        loading,
        error,
        fetchTeammates,
        hasLoaded
    };

    return (
        <TeammatesContext.Provider value={value}>
            {children}
        </TeammatesContext.Provider>
    );
};

export default TeammatesContext; 