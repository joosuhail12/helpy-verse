
import { useAppSelector } from '@/hooks/useAppSelector';
import { CompanyListItem } from './CompanyListItem';

export const CompaniesList = () => {
  const companies = useAppSelector(state => state.companies.companies);

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No companies yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first company
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map(company => (
        <CompanyListItem key={company.id} company={company} />
      ))}
    </div>
  );
};
