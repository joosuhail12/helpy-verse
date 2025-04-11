import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HttpClient } from '@/api/services/HttpClient';
import { getUserId } from '@/utils/helpers/helpers';

interface Team {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    workspaceId: string;
    clientId: string;
}

interface TeamsContextType {
    teams: Team[];
    loading: boolean;
    error: string | null;
    fetchTeams: () => Promise<void>;
    hasLoaded: boolean;
}

const TeamsContext = createContext<TeamsContextType | null>(null);

export const useTeams = () => {
    const context = useContext(TeamsContext);
    if (!context) {
        throw new Error('useTeams must be used within a TeamsProvider');
    }
    return context;
};

interface TeamsProviderProps {
    children: ReactNode;
}

export const TeamsProvider: React.FC<TeamsProviderProps> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchTeams = async () => {
        if (loading || hasLoaded) return;

        try {
            setLoading(true);
            setError(null);

            const userId = getUserId();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            const response = await HttpClient.apiClient.get(`/team/user/${userId}`);

            if (response.data.status === 'success') {
                setTeams(response.data.data);
                setHasLoaded(true);
            } else {
                setError('Failed to fetch teams data');
            }
        } catch (err) {
            console.error('Error fetching teams:', err);
            setError('Error connecting to the server');
        } finally {
            setLoading(false);
        }
    };

    // Value to be provided to consumers
    const value = {
        teams,
        loading,
        error,
        fetchTeams,
        hasLoaded
    };

    return (
        <TeamsContext.Provider value={value}>
            {children}
        </TeamsContext.Provider>
    );
};

export default TeamsContext; 