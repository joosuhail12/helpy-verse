
import { CustomFieldType } from '@/types/customData';

interface DisplayValueProps {
  type: CustomFieldType;
  value: string | number | boolean | string[];
}

export const DisplayValue = ({ type, value }: DisplayValueProps) => {
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
