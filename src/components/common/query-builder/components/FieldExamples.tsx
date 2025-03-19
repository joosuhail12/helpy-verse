
import { FieldType } from '@/types/queryBuilder';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { HelpCircle } from 'lucide-react';

const getExampleValues = (type: FieldType): string[] => {
  switch (type) {
    case 'text':
      return ['John Doe', 'support@example.com', 'Customer feedback'];
    case 'number':
      return ['42', '1000', '3.14'];
    case 'boolean':
      return ['true', 'false'];
    case 'date':
      return ['2024-03-15', '2023-12-31', 'Today'];
    case 'select':
      return ['Active', 'Inactive', 'Pending'];
    case 'multi-select':
      return ['Sales, Marketing', 'Support, Development', 'HR, Admin'];
    default:
      return ['Example value'];
  }
};

interface FieldExamplesProps {
  type: FieldType;
}

export const FieldExamples = ({ type }: FieldExamplesProps) => {
  const examples = getExampleValues(type);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button type="button" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Example Values</h4>
          <ul className="text-sm space-y-1">
            {examples.map((example, index) => (
              <li key={index} className="text-muted-foreground">{example}</li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

