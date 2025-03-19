
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import type { QueryField } from '@/types/queryBuilder';

interface FieldExamplesProps {
  selectedField?: QueryField;
}

export const FieldExamples = ({ selectedField }: FieldExamplesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const examples = useMemo(() => {
    if (!selectedField) return [];

    // Provide examples based on field type
    switch (selectedField.type) {
      case 'string':
      case 'text':
        return [
          { label: 'Example', value: 'John Doe' },
          { label: 'Example', value: 'acme@example.com' },
          { label: 'Wildcard', value: '*@gmail.com' },
        ];
      case 'number':
        return [
          { label: 'Example', value: '42' },
          { label: 'Range', value: '10-50' },
          { label: 'Above threshold', value: '>100' },
        ];
      case 'date':
        return [
          { label: 'Exact date', value: '2023-05-15' },
          { label: 'This month', value: 'THIS_MONTH' },
          { label: 'Last 30 days', value: 'LAST_30_DAYS' },
        ];
      case 'boolean':
        return [
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' },
        ];
      default:
        return [];
    }
  }, [selectedField]);

  if (!selectedField) return null;

  const filteredExamples = examples.filter(
    (example) => 
      example.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      example.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (examples.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardContent className="py-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Examples for {selectedField.label}</h3>
            <Input
              className="w-32 h-8 text-xs"
              placeholder="Filter examples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filteredExamples.map((example, index) => (
              <div key={index} className="bg-muted p-2 rounded text-xs">
                <div className="text-muted-foreground">{example.label}:</div>
                <div className="font-medium">{example.value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
