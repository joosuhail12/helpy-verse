import { useState, useEffect, useRef } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CustomFieldType } from '@/types/customData';
import { validateFieldValue } from '@/components/settings/customData/utils/fieldValidation';
import { EditButtons } from '@/components/contacts/detail/inline-edit/EditButtons';
import { EditField } from '@/components/contacts/detail/inline-edit/EditField';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateTicket, resetLoading, clearError } from '@/store/slices/tickets/ticketsSlice';
import { TicketDisplayValue } from './TicketDisplayValue';
import { useAppSelector } from '@/hooks/useAppSelector';

interface TicketInlineEditFieldProps {
    value: string | number | boolean | string[];
    ticketId: string;
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

export const TicketInlineEditField = ({
    value,
    ticketId,
    field,
    label,
    type = 'text',
    options = [],
    validation = []
}: TicketInlineEditFieldProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<string | number | boolean | string[]>(value);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    // Get global loading state from Redux
    const { loading: isReduxLoading, error: reduxError } = useAppSelector(
        state => state.tickets
    );

    // Update local error state if Redux has an error
    useEffect(() => {
        if (reduxError && isSaving) {
            setError(reduxError);
            setIsSaving(false);
        }
    }, [reduxError, isSaving]);

    // Auto exit editing mode when Redux loading completes
    useEffect(() => {
        if (isSaving && !isReduxLoading && !reduxError) {
            setIsEditing(false);
            setIsSaving(false);
        }
    }, [isReduxLoading, reduxError, isSaving]);

    // Force reset loading state if stuck for too long
    useEffect(() => {
        let forceResetTimer: NodeJS.Timeout;

        if (isSaving) {
            forceResetTimer = setTimeout(() => {
                // If still saving after 5 seconds, force reset regardless of Redux state
                setIsSaving(false);
                setIsEditing(false);
                dispatch(resetLoading());

                console.log("Force-reset loading state applied");
            }, 5000);
        }

        return () => {
            if (forceResetTimer) clearTimeout(forceResetTimer);
        };
    }, [isSaving, dispatch]);

    // Reset editValue when value prop changes
    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Reset loading state on unmount and on field change
    useEffect(() => {
        return () => {
            // Clear loading state when component unmounts
            dispatch(resetLoading());
            dispatch(clearError());
        };
    }, [dispatch]);

    // Sync with Redux loading state directly 
    useEffect(() => {
        // If Redux has explicitly set loading to false, make sure our local state reflects that
        if (!isReduxLoading && isSaving) {
            console.log('Syncing local loading state with Redux (false)');
            setIsSaving(false);
        }
    }, [isReduxLoading, isSaving]);

    // Update field view after edit completes
    useEffect(() => {
        // Check if edit just completed (was saving, now it's not)
        const editJustCompleted = !isSaving && !isEditing;

        if (editJustCompleted && currentTicketId) {
            // Force a UI refresh after loading is done 
            // by adding a small delay to ensure smooth transition
            const refreshTimer = setTimeout(() => {
                setEditValue(value);
            }, 200);

            return () => clearTimeout(refreshTimer);
        }
    }, [isSaving, isEditing, value]);

    // Store current ticket ID for tracking
    const currentTicketId = ticketId;

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

        // Explicitly ensure Redux state is clean before starting
        dispatch(resetLoading());
        dispatch(clearError());

        // Set a timeout to prevent the loading state from being stuck indefinitely
        const timeoutId = setTimeout(() => {
            if (isSaving) {
                setIsSaving(false);
                setIsEditing(false); // Force exit edit mode if stuck
                setError('Request took too long. Please try again.');
                // Also reset Redux state
                dispatch(resetLoading());
                toast({
                    title: 'Timeout',
                    description: 'The request took too long to complete.',
                    variant: 'destructive',
                });
            }
        }, 8000); // 8 second timeout

        try {
            // Properly unwrap the promise from dispatch
            const resultAction = await dispatch(updateTicket({
                ticket_sno: ticketId,
                updates: { [field]: editValue }
            }));

            clearTimeout(timeoutId); // Clear the timeout immediately after response

            // Check if the action was fulfilled or rejected
            if (updateTicket.fulfilled.match(resultAction)) {
                setIsEditing(false);
                setIsSaving(false); // Explicitly set loading to false
                toast({
                    title: 'Success',
                    description: `${label} has been updated.`,
                });
            } else {
                // This handles the case where the action was rejected
                const errorMsg = resultAction.error?.message || `Failed to update ${label.toLowerCase()}.`;
                setIsSaving(false); // Explicitly set loading to false
                setError(errorMsg);
                toast({
                    title: 'Error',
                    description: errorMsg,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            clearTimeout(timeoutId);
            // This catches any other unexpected errors
            console.error('Unexpected error during ticket update:', error);
            setIsSaving(false); // Explicitly set loading to false
            setError(`Failed to update ${label.toLowerCase()}.`);
            toast({
                title: 'Error',
                description: `Failed to update ${label.toLowerCase()}.`,
                variant: 'destructive',
            });
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
        setError(null);

        // Ensure we clear all loading states
        setIsSaving(false);
        dispatch(resetLoading());
        dispatch(clearError());
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

    // Show spinner if this specific field is saving
    if (isSaving) {
        return (
            <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                <span className="text-sm text-blue-500">Saving...</span>
            </div>
        );
    }

    return (
        <div className="group flex items-center gap-2">
            <TicketDisplayValue type={type} value={value} field={field} />
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