import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerById, selectCustomerById, selectIsCustomerLoading, selectCustomerName } from '@/store/slices/customers/customersSlice';
import type { AppDispatch, RootState } from '@/store/store';
import type { Contact } from '@/types/contact';

/**
 * Custom hook to get customer data by ID with automatic fetching
 * 
 * @param customerId - The ID of the customer to fetch
 * @returns Object containing customer data, loading state, and a formatted customer name
 */
export const useCustomer = (customerId?: string) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get customer data from Redux store
    const customer = useSelector((state: RootState) =>
        customerId ? selectCustomerById(state, customerId) : null
    ) as Contact | null;

    // Get loading state from Redux store
    const isLoading = useSelector((state: RootState) =>
        customerId ? selectIsCustomerLoading(state, customerId) : false
    );

    // Get pre-formatted customer name
    const customerName = useSelector((state: RootState) =>
        customerId ? selectCustomerName(state, customerId) : undefined
    );

    // Fetch customer data if needed
    useEffect(() => {
        if (customerId && !customer && !isLoading) {
            dispatch(fetchCustomerById(customerId));
        }
    }, [customerId, customer, isLoading, dispatch]);

    return {
        customer,
        isLoading,
        customerName
    };
};

export default useCustomer; 