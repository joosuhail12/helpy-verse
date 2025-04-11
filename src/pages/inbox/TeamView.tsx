import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketList from '@/components/inbox/TicketList';
import { setClientId } from '@/utils/helpers/helpers';
import { HttpClient } from '@/api/services/HttpClient';
import type { Ticket as TicketListType } from '@/types/ticket';
import { useTeams } from '@/contexts/TeamsContext';

const ITEMS_PER_PAGE = 5;

// API response ticket type
type ApiTicket = {
    id: string;
    sno?: number;
    title: string;
    description: string;
    customerId: string;
    customer?: any;
    assigneeId: string | null;
    assignee?: { name: string } | null;
    lastMessage: string;
    teamId: string;
    workspaceId?: string;
    clientId?: string;
    tags: string[];
    status: 'open' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
    lastMessageAt: string;
    isUnread?: boolean;
    hasNotification?: boolean;
    notificationType?: 'mention' | 'update' | 'assignment' | null;
};

type TicketResponse = {
    status: string;
    message: string;
    data: {
        docs: ApiTicket[];
    };
};

const TeamView = () => {
    const { teamId } = useParams();
    const { teams } = useTeams();
    const [teamName, setTeamName] = useState<string>('');
    const [tickets, setTickets] = useState<TicketListType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Find team name from context
    useEffect(() => {
        if (teams.length > 0 && teamId) {
            const team = teams.find(t => t.id === teamId);
            if (team) {
                setTeamName(team.name);
            }
        }
    }, [teams, teamId]);

    // Convert API ticket to TicketList format
    const convertApiTicketToTicket = (apiTicket: ApiTicket): TicketListType => {
        return {
            id: apiTicket.id || '',
            sno: apiTicket.sno || 0,
            subject: apiTicket.title || '',
            description: apiTicket.description || '',
            lastMessage: apiTicket.lastMessage || '',
            assignee: apiTicket.assignee?.name || null,
            assigneeId: apiTicket.assigneeId || null,
            company: apiTicket.customer?.name || '',
            tags: [],
            status: apiTicket.status || 'open',
            priority: apiTicket.priority || 'medium',
            createdAt: apiTicket.createdAt || new Date().toISOString(),
            updatedAt: apiTicket.updatedAt || new Date().toISOString(),
            lastMessageAt: apiTicket.lastMessageAt || new Date().toISOString(),
            customerId: apiTicket.customerId || '',
            customer: apiTicket.customerId || '',  // Pass the customer ID as a string
            teamId: apiTicket.teamId || '',
            hasNotification: false,
            isUnread: false,
            notificationType: null,
            // Add an externalId field to help with filtering
            externalId: apiTicket.id || ''
        };
    };

    useEffect(() => {
        const fetchTeamTickets = async () => {
            if (!teamId) return;

            try {
                setLoading(true);
                // Fetch tickets for the specific team
                const response = await HttpClient.apiClient.get<TicketResponse>(`/ticket?teamId=${teamId}`);

                if (response.data.status === 'success') {
                    // Map API tickets to TicketList format
                    const fetchedTickets = response.data.data.docs.map(convertApiTicketToTicket);

                    console.log(`Fetched ${fetchedTickets.length} tickets for team ${teamId}`);
                    setTickets(fetchedTickets);

                    // Extract clientId from the first API ticket if it exists
                    const clientId = response.data.data.docs[0]?.clientId;

                    // Store ID in cookie
                    if (clientId) {
                        setClientId(clientId);
                    }
                } else {
                    setError('Failed to fetch team tickets');
                }
            } catch (err) {
                console.error('Error fetching team tickets:', err);
                setError('Error connecting to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamTickets();
    }, [teamId]);

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-semibold">{teamName || `Team Tickets`}</h1>
                <p className="text-muted-foreground text-sm">
                    Viewing all tickets assigned to this team
                </p>
            </div>
            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">
                        {error}
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No tickets found for this team
                    </div>
                ) : (
                    <TicketList tickets={tickets} isLoading={loading} />
                )}
            </div>
        </div>
    );
};

export default TeamView; 