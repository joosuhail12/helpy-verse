import { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CustomFieldType } from '@/types/customData';
import { validateFieldValue } from '@/components/settings/customData/utils/fieldValidation';
import { EditButtons } from '@/components/contacts/detail/inline-edit/EditButtons';
import { EditField } from '@/components/contacts/detail/inline-edit/EditField';
import { DisplayValue } from '@/components/contacts/detail/inline-edit/DisplayValue';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCustomer } from '@/store/slices/contacts/contactsSlice';

interface CustomerInlineEditFieldProps {
    value: string | number | boolean | string[];
    customerId: string;
    field: string;
    label: string;
    type?: CustomFieldType;
    options?: string[];
    validation?: {
        type: 'required' | 'minLength' | 'maxLength' | 'regex' | 'min' | 'max';
        value: string | number;
        message: string;
    }[];
}

export const CustomerInlineEditField = ({
    value,
    customerId,
    field,
    label,
    type = 'text',
    options = [],
    validation = []
}: CustomerInlineEditFieldProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<string | number | boolean | string[]>(value);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = async () => {
        // Validate field before saving
        const mockField = {
            id: field,
            name: label,
            type,
            required: validation.some(v => v.type === 'required'),
            validationRules: validation,
            description: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: []
        };

        const validationErrors = validateFieldValue(editValue, mockField);
        if (validationErrors.length > 0) {
            setError(validationErrors[0]);
            toast({
                title: 'Validation Error',
                description: validationErrors[0],
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            // Dispatch update to Redux store with workspace_id included in the query params
            await dispatch(updateCustomer({
                customer_id: customerId,
                [field]: editValue
            }));

            setIsEditing(false);
            toast({
                title: 'Success',
                description: `${label} has been updated.`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to update ${label.toLowerCase()}.`,
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
        setError(null);
    };

    if (isEditing) {
        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <EditField
                        type={type}
                        value={editValue}
                        onChange={(newValue) => setEditValue(newValue)}
                        options={options}
                        isSaving={isSaving}
                        inputRef={inputRef}
                    />
                    <EditButtons
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isSaving={isSaving}
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className="group flex items-center gap-2">
            <DisplayValue type={type} value={value} />
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
        </div>
    );
}; 