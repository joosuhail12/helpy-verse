import { CustomFieldType } from '@/types/customData';
import { Badge } from '@/components/ui/badge';

interface TicketDisplayValueProps {
    type: CustomFieldType;
    value: string | number | boolean | string[];
    field: string;
}

export const TicketDisplayValue = ({ type, value, field }: TicketDisplayValueProps) => {
    if (field === 'status') {
        const status = String(value);
        return (
            <Badge
                variant="outline"
                className={
                    status === 'open'
                        ? 'bg-green-50 text-green-700'
                        : status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-50 text-gray-700'
                }
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    }

    if (field === 'priority') {
        const priority = String(value);
        return (
            <Badge
                variant="outline"
                className={
                    priority === 'high'
                        ? 'bg-red-50 text-red-700'
                        : priority === 'medium'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                }
            >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    }

    // For other fields, render standard value
    const renderValue = () => {
        switch (type) {
            case 'boolean':
                return String(value) === 'true' ? 'Yes' : 'No';
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(Number(value) || 0);
            case 'multi-select':
                return Array.isArray(value) ? value.join(', ') : value;
            default:
                return Array.isArray(value) ? value.join(', ') : value;
        }
    };

    return (
        <span className="min-w-[100px] py-1 px-2 rounded transition-colors group-hover:bg-gray-100">
            {renderValue()}
        </span>
    );
}; 