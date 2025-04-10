import type { Contact } from '@/types/contact';
import { HttpClient } from '@/api/services/http';


const API_URL = '/customer';
const MAX_RETRIES = 3;

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
            
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            console.log('Fetching customers with workspace ID:', workspaceId);
            
            // Check if we should use a test response for development
            if (import.meta.env.DEV && import.meta.env.VITE_REACT_APP_USE_MOCK_DATA === 'true') {
                console.log('Using mock data for customers');
                return {
                    status: 'success',
                    message: 'Mock customers retrieved successfully',
                    data: getMockCustomers()
                };
            }
            
            const response = await HttpClient.apiClient.get<CustomersResponse>(API_URL, {
                params: { workspace_id: workspaceId }
            });
            console.log(`Successfully fetched customers:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching customers:', error);
            
            // Check if it's a timeout error
            if (error.isTimeoutError || error.code === 'ECONNABORTED') {
                console.log(`Customer fetch timed out`);
                if (retryCount < MAX_RETRIES) {
                    console.log(`Retrying fetchCustomers (${retryCount + 1}/${MAX_RETRIES})...`);
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retryCount)));
                    return this.fetchCustomers(retryCount + 1);
                }
                
                // If all retries failed, return mock data in development
                if (import.meta.env.DEV) {
                    console.log('Falling back to mock data after timeout');
                    return {
                        status: 'success',
                        message: 'Mock customers retrieved as fallback',
                        data: getMockCustomers()
                    };
                }
                
                throw new Error('Request timed out after multiple attempts. Please try again later.');
            }
            
            // Implement retry for network errors or 5xx server errors
            if (retryCount < MAX_RETRIES && (error.isServerError || error.isOfflineError || !navigator.onLine)) {
                console.log(`Retrying fetchCustomers (${retryCount + 1}/${MAX_RETRIES})...`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retryCount)));
                return this.fetchCustomers(retryCount + 1);
            }
            
            // If all retries failed, return mock data in development
            if (import.meta.env.DEV) {
                console.log('Falling back to mock data after error');
                return {
                    status: 'success',
                    message: 'Mock customers retrieved as fallback',
                    data: getMockCustomers()
                };
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
            
            // Get workspace ID from localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const response = await HttpClient.apiClient.get<CustomerResponse>(`${API_URL}/${customer_id}`, {
                params: { workspace_id: workspaceId }
            });
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
    async createCustomer(customerData: Omit<CreateCustomerData, 'workspace_id'>): Promise<CustomerResponse> {
        try {
            // Get workspace ID from env or localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const payload = {
                ...customerData,
                workspace_id: workspaceId
            };
            
            const response = await HttpClient.apiClient.post<CustomerResponse>(API_URL, payload);
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
            
            // Get workspace ID from env or localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            formData.append('workspace_id', workspaceId);

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
            // Get workspace ID from env or localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            const payload = {
                ...customerData,
                workspace_id: workspaceId
            };
            
            const response = await HttpClient.apiClient.put<Contact>(`${API_URL}/${customer_id}`, payload);
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
            // Get workspace ID from env or localStorage
            const workspaceId = localStorage.getItem('workspaceId');
            
            await HttpClient.apiClient.delete(`${API_URL}/${customer_id}`, {
                params: { workspace_id: workspaceId }
            });
        } catch (error: any) {
            console.error('Error deleting customer:', error);
            throw error.isServerError 
                ? new Error('Server error. Please try again later.') 
                : new Error('Failed to delete customer');
        }
    }
};

// Mock data for development fallback
function getMockCustomers(): Contact[] {
    return [
        {
            id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            status: 'active',
            type: 'customer',
            tags: ['VIP', 'New'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: '2',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane.smith@example.com',
            status: 'active',
            type: 'customer',
            tags: ['Lead'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: '3',
            firstname: 'Robert',
            lastname: 'Johnson',
            email: 'robert.johnson@example.com',
            status: 'inactive',
            type: 'visitor',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];
}
