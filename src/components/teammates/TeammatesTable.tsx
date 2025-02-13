
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Teammate } from '@/types/teammate';
import TeammateTableRow from './TeammateTableRow';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TeammatesTableProps {
  teammates: Teammate[];
  selectedTeammates: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectTeammate: (teammateId: string, checked: boolean) => void;
  onResendInvitation: (teammateId: string) => void;
  sortBy: keyof Teammate | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Teammate) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TeammatesTable = ({
  teammates,
  selectedTeammates,
  onSelectAll,
  onSelectTeammate,
  onResendInvitation,
  sortBy,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange
}: TeammatesTableProps) => {
  const renderSortIcon = (column: keyof Teammate) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  const handleSortClick = (column: keyof Teammate) => {
    onSort(column);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedTeammates.length === teammates.length}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead 
              className="w-[250px] cursor-pointer"
              onClick={() => handleSortClick('name')}
            >
              Name {renderSortIcon('name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSortClick('role')}
            >
              Role {renderSortIcon('role')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSortClick('status')}
            >
              Status {renderSortIcon('status')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSortClick('lastActive')}
            >
              Last Active {renderSortIcon('lastActive')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSortClick('createdAt')}
            >
              Joined {renderSortIcon('createdAt')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teammates.map((teammate) => (
            <TeammateTableRow
              key={teammate.id}
              teammate={teammate}
              isSelected={selectedTeammates.includes(teammate.id)}
              onSelect={onSelectTeammate}
              onResendInvitation={onResendInvitation}
            />
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TeammatesTable;
