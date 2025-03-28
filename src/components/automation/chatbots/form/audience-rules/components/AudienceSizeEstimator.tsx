
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAllContacts } from '@/store/slices/contacts/contactsSlice';
import { selectAllCompanies } from '@/store/slices/companies/companiesSlice';

interface AudienceSizeEstimatorProps {
  matchCount: number;
  isLoading?: boolean;
}

const AudienceSizeEstimator: React.FC<AudienceSizeEstimatorProps> = ({ matchCount, isLoading = false }) => {
  const contacts = useAppSelector(selectAllContacts);
  const companies = useAppSelector(selectAllCompanies);
  const totalPossible = contacts.length + companies.length;
  
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    if (totalPossible > 0) {
      setProgressValue((matchCount / totalPossible) * 100);
    } else {
      setProgressValue(0);
    }
  }, [matchCount, totalPossible]);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Estimated audience size:</span>
        <span className="font-medium">
          {isLoading ? 'Calculating...' : `${matchCount} of ${totalPossible}`}
        </span>
      </div>
      <Progress value={progressValue} className="h-2" />
      {progressValue < 10 && !isLoading && (
        <p className="text-xs text-amber-600">
          Warning: Very small audience. Consider relaxing your targeting criteria.
        </p>
      )}
    </div>
  );
};

export default AudienceSizeEstimator;
