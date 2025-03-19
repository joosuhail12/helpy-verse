import type { Contact } from '@/types/contact';
import { HttpClient } from '@/api/services/http';

const API_URL = '/customer';

export interface CustomersResponse {
    status: string;
    message: string;
    data: Contact[];
}

export interface CustomerResponse {
    status: string;
    message: string;
    data: Contact;
}

export interface CustomerParams {
    searchQuery?: string;
    workspace_id: string;
    page?: number;
    limit?: number;
    archived?: boolean;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CreateCustomerData {
    firstname: string;
    lastname: string;
    email: string;
    type?: string;
    phone?: string;
    phoneCountry?: string;
    companyId?: string;
    workspace_id: string;
}

export const customerService = {
    // ✅ Fetch list of customers
    async fetchCustomers(): Promise<CustomersResponse> {
        try {
            const response = await HttpClient.apiClient.get<CustomersResponse>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw new Error('Failed to fetch customers');
        }
    },

    // ✅ Get details of a specific customer
    async getCustomerDetails(customer_id: string): Promise<CustomerResponse> {
        try {
            const response = await HttpClient.apiClient.get<CustomerResponse>(`${API_URL}/${customer_id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer details:', error);
            throw new Error('Failed to fetch customer details');
        }
    },

    // ✅ Create a new customer
    async createCustomer(customerData: CreateCustomerData): Promise<CustomerResponse> {
        try {
            const response = await HttpClient.apiClient.post<CustomerResponse>(API_URL, customerData);
            return response.data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw new Error('Failed to create customer');
        }
    },

    // ✅ Import customers via CSV
    async importCustomers(csvFile: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('file', csvFile);

            await HttpClient.apiClient.post(`${API_URL}/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            console.error('Error importing customers:', error);
            throw new Error('Failed to import customers');
        }
    },

    // ✅ Update a customer
    async updateCustomer(customer_id: string, customerData: Partial<Contact>): Promise<Contact> {
        try {
            const response = await HttpClient.apiClient.put<Contact>(`${API_URL}/${customer_id}`, customerData);
            return response.data;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw new Error('Failed to update customer');
        }
    }
};
