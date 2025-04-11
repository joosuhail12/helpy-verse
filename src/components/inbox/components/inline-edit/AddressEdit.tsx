import { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCustomer } from '@/store/slices/contacts/contactsSlice';

interface AddressEditProps {
    initialValue: string;
    customerId?: string;
    customer?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
}

export const AddressEdit = ({ initialValue, customerId, customer }: AddressEditProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [street, setStreet] = useState(customer?.street || '');
    const [city, setCity] = useState(customer?.city || '');
    const [state, setState] = useState(customer?.state || '');
    const [postalCode, setPostalCode] = useState(customer?.postalCode || '');
    const [country, setCountry] = useState(customer?.country || '');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const streetInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isEditing && streetInputRef.current) {
            streetInputRef.current.focus();
        }
    }, [isEditing]);

    // Update values when customer data changes
    useEffect(() => {
        if (customer) {
            setStreet(customer.street || '');
            setCity(customer.city || '');
            setState(customer.state || '');
            setPostalCode(customer.postalCode || '');
            setCountry(customer.country || '');
        }
    }, [customer]);

    const formatAddress = () => {
        if (customer) {
            const parts = [];
            if (customer.street) parts.push(customer.street);

            const cityStatePostal = [];
            if (customer.city) cityStatePostal.push(customer.city);
            if (customer.state) cityStatePostal.push(customer.state);
            if (customer.postalCode) cityStatePostal.push(customer.postalCode);

            if (cityStatePostal.length > 0) {
                parts.push(cityStatePostal.join(', '));
            }

            if (customer.country) parts.push(customer.country);

            if (parts.length > 0) {
                return parts.join('\n');
            }
        }
        return initialValue || 'No address provided';
    };

    const handleSave = async () => {
        if (!customerId) {
            toast({
                title: 'Error',
                description: 'Customer ID is missing. Cannot update address.',
                variant: 'destructive',
            });
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await dispatch(updateCustomer({
                customer_id: customerId,
                street,
                city,
                state,
                postalCode,
                country
            }));

            setIsEditing(false);
            toast({
                title: 'Success',
                description: 'Address has been updated.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update address.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (customer) {
            setStreet(customer.street || '');
            setCity(customer.city || '');
            setState(customer.state || '');
            setPostalCode(customer.postalCode || '');
            setCountry(customer.country || '');
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="space-y-2">
                <div className="flex flex-col gap-2">
                    <Input
                        ref={streetInputRef}
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="h-8"
                        placeholder="Street"
                        disabled={isSaving}
                    />
                    <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-8"
                        placeholder="City"
                        disabled={isSaving}
                    />
                    <Input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="h-8"
                        placeholder="State"
                        disabled={isSaving}
                    />
                    <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="h-8"
                        placeholder="Postal Code"
                        disabled={isSaving}
                    />
                    <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-8"
                        placeholder="Country"
                        disabled={isSaving}
                    />
                </div>
                <div className="flex items-center gap-1 justify-end">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-8 px-2 py-0"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="h-8 px-2 py-0"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative">
            <div className="pr-8 text-gray-700 whitespace-pre-line">{formatAddress()}</div>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0"
            >
                <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
        </div>
    );
}; 