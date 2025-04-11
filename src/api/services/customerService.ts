import type { Contact } from '@/types/contact';
import { HttpClient } from '@/api/services/HttpClient';
import type { Customer } from '@/types/customer';

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

export interface UpdateCustomerResponse {
    status: string;
    message: string;
    data: Customer;
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

    // ✅ Fetch customer by ID (for customer name display)
    async fetchCustomerById(customerId: string): Promise<CustomerResponse> {
        try {
            const response = await HttpClient.apiClient.get<CustomerResponse>(`${API_URL}/${customerId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching customer with ID ${customerId}:`, error);
            throw new Error(`Failed to fetch customer with ID ${customerId}`);
        }
    },

    // ✅ Batch fetch multiple customers by IDs
    async fetchCustomersByIds(customerIds: string[]): Promise<Record<string, Contact>> {
        try {
            if (!customerIds.length) return {};

            // Create promises for all customer requests
            const promises = customerIds.map(id =>
                HttpClient.apiClient.get<CustomerResponse>(`${API_URL}/${id}`)
                    .then(response => ({ id, data: response.data.data }))
                    .catch(error => {
                        console.error(`Error fetching customer with ID ${id}:`, error);
                        return { id, data: null };
                    })
            );

            // Execute all promises in parallel
            const results = await Promise.all(promises);

            // Convert results to a map of customerId -> customer data
            return results.reduce((acc, { id, data }) => {
                if (data) {
                    acc[id] = data;
                }
                return acc;
            }, {} as Record<string, Contact>);
        } catch (error) {
            console.error('Error batch fetching customers:', error);
            throw new Error('Failed to batch fetch customers');
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
    async updateCustomer(customerId: string, customerData: Partial<Customer>): Promise<UpdateCustomerResponse> {
        try {
            // Remove workspace_id from the body if it exists
            const { workspace_id, ...cleanedData } = customerData as any;

            const response = await HttpClient.apiClient.put<UpdateCustomerResponse>(
                `${API_URL}/${customerId}`,
                cleanedData
            );
            return response.data;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw new Error('Failed to update customer');
        }
    }
};
