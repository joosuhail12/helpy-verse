
import { Text, HashIcon, CheckSquare, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CustomAction } from '@/types/action';

interface TypeIndicatorProps {
  type: CustomAction['parameters'][0]['type'];
}

export const TypeIndicator = ({ type }: TypeIndicatorProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'string':
        return <Text className="h-4 w-4 text-blue-500" />;
      case 'number':
        return <HashIcon className="h-4 w-4 text-green-500" />;
      case 'boolean':
        return <CheckSquare className="h-4 w-4 text-purple-500" />;
      case 'object':
      case 'array':
        return <Database className="h-4 w-4 text-orange-500" />;
      default:
        return <Text className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {getTypeIcon()}
      <Badge variant="outline">{type}</Badge>
    </div>
  );
};

