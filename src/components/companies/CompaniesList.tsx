
import { useAppSelector } from '@/hooks/useAppSelector';
import { CompanyListItem } from './CompanyListItem';
import { LoadingState } from './LoadingState';
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
              <Checkbox />
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
