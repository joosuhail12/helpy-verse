
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  toggleCompanySelection,
} from '@/store/slices/companies/companiesSlice';
import { 
  selectAllCompanies, 
  selectCompaniesLoading,
  selectSelectedCompanyIds 
} from '@/store/slices/companies/selectors';
import { CompanyListItem } from './CompanyListItem';
import { LoadingState } from './LoadingState';

export interface CompanyListItemProps {
  company: any;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}

export const CompaniesList = () => {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(selectAllCompanies);
  const loading = useAppSelector(selectCompaniesLoading);
  const selectedCompanyIds = useAppSelector(selectSelectedCompanyIds);

  const handleToggleSelection = (id: string) => {
    dispatch(toggleCompanySelection(id));
  };

  if (loading && companies.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {companies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No companies found</p>
        </div>
      ) : (
        <ul className="divide-y">
          {companies.map((company) => (
            <CompanyListItem 
              key={company.id} 
              company={company} 
              isSelected={selectedCompanyIds.includes(company.id)}
              onToggleSelect={handleToggleSelection}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
