
import { Building2, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Company } from '@/types/company';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleCompanySelection } from '@/store/slices/companies/companiesSlice';

interface CompanyListItemProps {
  company: Company;
}

export const CompanyListItem = ({ company }: CompanyListItemProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRowClick = () => {
    navigate(`/home/contacts/companies/${company.id}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCompanySelection(company.id));
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50"
      onClick={handleRowClick}
    >
      <TableCell onClick={handleCheckboxClick}>
        <Checkbox />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-purple-100 rounded-lg">
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <span>{company.name}</span>
        </div>
      </TableCell>
      <TableCell>{company.website || '-'}</TableCell>
      <TableCell>{company.industry || '-'}</TableCell>
      <TableCell>
        <Badge variant={company.type === 'customer' ? 'default' : 'secondary'}>
          {company.type || 'N/A'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={company.status === 'active' ? 'default' : 'destructive'}>
          {company.status === 'active' ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              <span>Inactive</span>
            </div>
          )}
        </Badge>
      </TableCell>
      <TableCell>
        {company.location?.city && company.location?.country ? 
          `${company.location.city}, ${company.location.country}` : '-'}
      </TableCell>
      <TableCell>
        {company.numberOfEmployees ? `${company.numberOfEmployees}` : '-'}
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
