export type CannedResponseSharing = 'view' | 'edit';

export type CannedResponseSharedTeams = {
    teamId: string;
    typeOfSharing: CannedResponseSharing;
}

export type CreateCannedResponse = {
    name: string;
    message: string;
    shortcut: string;
    category: 'greeting' | 'support' | 'technical' | 'closing';
    isShared: boolean;
    sharedTeams?: CannedResponseSharedTeams[];
};

export type CannedResponse = {
    id: string;
    name: string;
    message: string;
    shortcut: string;
    category: 'greeting' | 'support' | 'technical' | 'closing';
    isShared: boolean;
    numberOfTimesUsed: number;
}