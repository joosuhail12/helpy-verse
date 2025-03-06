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
    sharedTeams?: [{
        teamId: string,
        name: string,
        typeOfSharing: "view" | "edit"
    }]
};

export type UpdateCannedResponse = {
    id: string;
    name?: string;
    message?: string;
    shortcut?: string;
    category?: 'greeting' | 'support' | 'technical' | 'closing';
    isShared?: boolean;
    sharedTeams?: [{
        teamId: string,
        name: string,
        typeOfSharing: "view" | "edit"
    }]
}