
// src/api/services/companiesService.ts

import { FilterEntity } from '@/types/tag';
import { SortField } from '@/types/tag';
import { HttpClient } from '@/api/services/http';
import type { Company } from '@/types/company';

// Changed from '/company' to '/company' - ensuring it's the correct API endpoint
const API_URL = '/company';

export interface CompaniesResponse {
    data: any;
    companies: Company[];
    total: number;
}

export interface CreateCompaniesResponse {
    data: {
        companyList: Company[];
    };
}

export interface CompanyResponse {
    data: Company;
}
export interface CompanyParams {
    searchQuery?: string;
    filterEntity?: FilterEntity;
    sortField?: SortField;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    workspace_id?: string;
}

export const companiesService = {
    async fetchCompanies(params: CompanyParams = {}): Promise<CompaniesResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            // Ensure workspace_id is included in params
            const queryParams = {
                ...params,
                workspace_id: params.workspace_id || workspaceId
            };
            
            console.log('Fetching companies with params:', queryParams);
            const response = await HttpClient.apiClient.get<CompaniesResponse>(API_URL, { params: queryParams });
            console.log('Companies response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw new Error('Failed to fetch companies');
        }
    },

    async createCompany(company: Partial<Company>): Promise<CreateCompaniesResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const payload = {
                ...company,
                workspace_id: workspaceId
            };
            
            const response = await HttpClient.apiClient.post<CreateCompaniesResponse>(API_URL, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating company:', error);
            throw new Error('Failed to create company');
        }
    },

    async updateCompany(id: string, company: Partial<Company>): Promise<CompanyResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const payload = {
                ...company,
                workspace_id: workspaceId
            };
            
            const response = await HttpClient.apiClient.put<CompanyResponse>(`${API_URL}/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating company:', error);
            throw new Error('Failed to update company');
        }
    },

    async deleteCompany(id: string): Promise<void> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            await HttpClient.apiClient.delete(`${API_URL}/${id}`, {
                params: { workspace_id: workspaceId }
            });
        } catch (error) {
            console.error('Error deleting company:', error);
            throw new Error('Failed to delete company');
        }
    },
    
    async getCompany(id: string): Promise<CompanyResponse> {
        try {
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const response = await HttpClient.apiClient.get<CompanyResponse>(`${API_URL}/${id}`, {
                params: { workspace_id: workspaceId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching company:', error);
            throw new Error('Failed to fetch company');
        }
    }
};
