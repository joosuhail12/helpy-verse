
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryGroup } from '@/types/queryBuilder';
import { evaluateRules } from '../utils/validation';
import { Loader2 } from 'lucide-react';

interface SampleMatchesPreviewProps {
  queryGroup: QueryGroup;
}

const sampleData = [
  { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', customer_type: 'lead', company_size: 'small' },
  { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', customer_type: 'customer', company_size: 'medium' },
  { id: 3, firstname: 'Mike', lastname: 'Johnson', email: 'mike@example.com', customer_type: 'partner', company_size: 'large' },
];

const SampleMatchesPreview = ({ queryGroup }: SampleMatchesPreviewProps) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      const matchingRecords = sampleData.filter(record => evaluateRules(queryGroup, record));
      setMatches(matchingRecords);
      setLoading(false);
    }, 500);
  }, [queryGroup]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sample Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-2">
            {matches.map((match) => (
              <div key={match.id} className="p-3 border rounded-md bg-slate-50">
                <p className="font-medium">{match.firstname} {match.lastname}</p>
                <p className="text-sm text-gray-500">{match.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {match.customer_type}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {match.company_size}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No matching records found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SampleMatchesPreview;
