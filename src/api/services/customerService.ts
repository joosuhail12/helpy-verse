import type { Contact } from '@/types/contact';
import { HttpClient } from '@/api/services/http';

const API_URL = '/customer';
const MAX_RETRIES = 2;

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
    // ✅ Fetch list of customers - now using the specialized contacts client with longer timeout
    async fetchCustomers(retryCount = 0): Promise<CustomersResponse> {
        try {
            console.log(`Attempting to fetch customers (try ${retryCount + 1}/${MAX_RETRIES + 1})`);
            const response = await HttpClient.contactsClient.get<CustomersResponse>(API_URL);
            console.log(`Successfully fetched customers`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching customers:', error);
            
            // Check if it's a timeout error
            if (error.isTimeoutError) {
                console.log(`Customer fetch timed out`);
                if (retryCount < MAX_RETRIES) {
                    console.log(`Retrying fetchCustomers (${retryCount + 1}/${MAX_RETRIES})...`);
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
                    return this.fetchCustomers(retryCount + 1);
                }
                throw new Error('Request timed out after multiple attempts. Please try again later.');
            }
            
            // Implement retry for network errors or 5xx server errors
            if (retryCount < MAX_RETRIES && (error.isServerError || error.isOfflineError)) {
                console.log(`Retrying fetchCustomers (${retryCount + 1}/${MAX_RETRIES})...`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
                return this.fetchCustomers(retryCount + 1);
            }
            
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error(error.message || 'Failed to fetch customers');
        }
    },

    // ✅ Get details of a specific customer - now using the specialized contacts client with longer timeout
    async getCustomerDetails(customer_id: string, retryCount = 0): Promise<CustomerResponse> {
        try {
            console.log(`Fetching customer details for ID: ${customer_id} (try ${retryCount + 1}/${MAX_RETRIES + 1})`);
            const response = await HttpClient.contactsClient.get<CustomerResponse>(`${API_URL}/${customer_id}`);
            console.log(`Successfully fetched customer details for ID: ${customer_id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching customer details:', error);
            
            // Check if it's a timeout error
            if (error.isTimeoutError) {
                if (retryCount < MAX_RETRIES) {
                    console.log(`Retrying getCustomerDetails (${retryCount + 1}/${MAX_RETRIES})...`);
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
                    return this.getCustomerDetails(customer_id, retryCount + 1);
                }
                throw new Error('Request timed out after multiple attempts. Please try again later.');
            }
            
            // Implement retry for network errors or 5xx server errors
            if (retryCount < MAX_RETRIES && (error.isServerError || error.isOfflineError)) {
                console.log(`Retrying getCustomerDetails (${retryCount + 1}/${MAX_RETRIES})...`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
                return this.getCustomerDetails(customer_id, retryCount + 1);
            }
            
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error(error.message || 'Failed to fetch customer details');
        }
    },

    // ✅ Create a new customer
    async createCustomer(customerData: CreateCustomerData): Promise<CustomerResponse> {
        try {
            const response = await HttpClient.apiClient.post<CustomerResponse>(API_URL, customerData);
            return response.data;
        } catch (error: any) {
            console.error('Error creating customer:', error);
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error('Failed to create customer');
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
        } catch (error: any) {
            console.error('Error importing customers:', error);
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error('Failed to import customers');
        }
    },

    // ✅ Update a customer
    async updateCustomer(customer_id: string, customerData: Partial<Contact>): Promise<Contact> {
        try {
            const response = await HttpClient.apiClient.put<Contact>(`${API_URL}/${customer_id}`, customerData);
            return response.data;
        } catch (error: any) {
            console.error('Error updating customer:', error);
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error('Failed to update customer');
        }
    },

    // ✅ Delete a customer
    async deleteContact(customer_id: string): Promise<void> {
        try {
            await HttpClient.apiClient.delete(`${API_URL}/${customer_id}`);
        } catch (error: any) {
            console.error('Error deleting customer:', error);
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error('Failed to delete customer');
        }
    }
};
