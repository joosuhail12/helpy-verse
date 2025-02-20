export type Domain = {
    id: string;
    domain: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt?: string;
    description: string;
};

export type AddNewDomain = {
    name: string;
    domain: string;
}