// src/api/services/emailService.ts

import { HttpClient } from './HttpClient';
import { AddNewDomain, Domain } from '@/types/domains';

const API_URL = '/email-domain';

export interface DomainsReponse {
    data: Domain[];
    message: string;
    status: string;
}

type DnsRecord = {
    name?: string;
    valid: string;
    value: string;
    cached: string[];
    priority?: string;
    is_active: boolean;
    record_type: string;
};

export type DomainDetails = {
    id: string;
    domain: string;
    description: string | null;
    clientId: string;
    createdBy: string;
    archiveAt: string | null;
    createdAt: string;
    updatedAt: string | null;
    workspaceId: string;
    isVerified: boolean;
    dnsRecords: DnsRecord[];
    mailgunRouteId: string | null;
    name: string;
};

export interface DomainDetailsResponse {
    status: string;
    message: string;
    data: DomainDetails;
};

export interface AddDomainResponse {
    data: {
        id: string;
    }
    message: string;
    status: string;
}

export interface DeleteDomainResponse {
    message: string;
    status: string;
}


export const emailService = {
    async getDomains(): Promise<DomainsReponse> {
        try {
            const response = await HttpClient.apiClient.get<DomainsReponse>(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching email domains:', error);
            throw new Error('Failed to fetch email domains');
        }
    },

    async addDomain(domain: AddNewDomain): Promise<AddDomainResponse> {
        try {
            const response = await HttpClient.apiClient.post<AddDomainResponse>(`${API_URL}`, domain);
            return response.data;
        } catch (error) {
            console.error('Error creating domain:', error);
            throw new Error('Failed to create domain');
        }
    },

    async deleteDomain(id: string): Promise<DeleteDomainResponse> {
        try {
            const response = await HttpClient.apiClient.delete<DeleteDomainResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting domain:', error);
            throw new Error('Failed to delete domain');
        }
    },

    async getSingleDomainDetails(id: string): Promise<DomainDetailsResponse> {
        try {
            const response = await HttpClient.apiClient.get<DomainDetailsResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching domain details:', error);
            throw new Error('Failed to fetch domain details');
        }
    },

    async verifyDomain(id: string): Promise<DomainDetailsResponse> {
        try {
            const response = await HttpClient.apiClient.post<DomainDetailsResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error verifying domain:', error);
            throw new Error('Failed to verify domain');
        }
    }
};