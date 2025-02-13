
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Teammate } from '@/types/teammate';
import TeammateTableRow from './TeammateTableRow';

interface TeammatesTableProps {
  teammates: Teammate[];
  selectedTeammates: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectTeammate: (teammateId: string, checked: boolean) => void;
  onResendInvitation: (teammateId: string) => void;
}

const TeammatesTable = ({
  teammates,
  selectedTeammates,
  onSelectAll,
  onSelectTeammate,
  onResendInvitation
}: TeammatesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedTeammates.length === teammates.length}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            />
          </TableHead>
          <TableHead className="w-[250px]">Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Joined</TableHead>
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
  );
};

export default TeammatesTable;
