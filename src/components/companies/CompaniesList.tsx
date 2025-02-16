
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { CompanyListItem } from './CompanyListItem';
import { LoadingState } from './LoadingState';
import { Checkbox } from '@/components/ui/checkbox';
import type { Company } from '@/types/company';
import { setSelectedCompanies } from '@/store/slices/companies/companiesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CompaniesListProps {
  companies: Company[];
  loading: boolean;
}

export const CompaniesList = ({ companies, loading }: CompaniesListProps) => {
  const dispatch = useAppDispatch();
  const selectedCompanies = useAppSelector((state) => state.companies.selectedCompanies);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      dispatch(setSelectedCompanies(companies.map(company => company.id)));
    } else {
      dispatch(setSelectedCompanies([]));
    }
  };

  if (loading) {
    return <LoadingState />;
  }

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
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCompanies.length === companies.length}
                onCheckedChange={handleSelectAll}
                aria-label="Select all companies"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map(company => (
            <CompanyListItem key={company.id} company={company} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

