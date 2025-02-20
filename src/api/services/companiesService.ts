// src/api/services/companiesService.ts

import { FilterEntity } from '@/types/tag';
import { SortField } from '@/types/tag';
import { HttpClient } from './HttpClient';
import type { Company } from '@/types/company';


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
}

export const companiesService = {
    async fetchCompanies(): Promise<CompaniesResponse> {
        try {
            const response = await HttpClient.apiClient.get<CompaniesResponse>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw new Error('Failed to fetch companies');
        }
    },

    async createCompany(company: Partial<Company>): Promise<CreateCompaniesResponse> {
        try {
            const response = await HttpClient.apiClient.post<CreateCompaniesResponse>(API_URL, company);
            return response.data;
        } catch (error) {
            console.error('Error creating company:', error);
            throw new Error('Failed to create company');
        }
    },

    async updateCompany(id: string, company: Partial<Company>): Promise<CompanyResponse> {
        try {
            const response = await HttpClient.apiClient.put<CompanyResponse>(`${API_URL}/${id}`, company);
            return response.data;
        } catch (error) {
            console.error('Error updating company:', error);
            throw new Error('Failed to update company');
        }
    },

    async deleteCompany(id: string): Promise<void> {
        try {
            await HttpClient.apiClient.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting company:', error);
            throw new Error('Failed to delete company');
        }
    },
    async getCompany(id: string): Promise<CompanyResponse> {
        try {
            const response = await HttpClient.apiClient.get<CompanyResponse>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching company:', error);
            throw new Error('Failed to fetch company');
        }
    }
};