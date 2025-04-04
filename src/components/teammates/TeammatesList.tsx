
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import TeammateStatusBadge from './TeammateStatusBadge';
import TeammateRoleBadge from './TeammateRoleBadge';
import TeammateEmail from './TeammateEmail';
import TeammateAvatar from './TeammateAvatar';
import { format } from 'date-fns';
import { Teammate } from '@/types/teammate';

interface TeammatesListProps {
  teammates: Teammate[];
}

const TeammatesList: React.FC<TeammatesListProps> = ({ teammates }) => {
  // State for editable teammate names
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editedName, setEditedName] = React.useState('');

  const handleStartEditing = (teammate: Teammate) => {
    setEditingId(teammate.id);
    setEditedName(teammate.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (teammateId: string) => {
    // Implementation would call an API to update the teammate name
    console.log(`Saving name change for teammate ${teammateId}: ${editedName}`);
    setEditingId(null);
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox id="select-all" />
            </TableHead>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teammates.map((teammate) => (
            <TableRow key={teammate.id} className="group">
              <TableCell>
                <Checkbox id={`select-${teammate.id}`} />
              </TableCell>
              <TableCell>
                <TeammateAvatar
                  teammate={teammate}
                  isEditing={editingId === teammate.id}
                  editedName={editedName}
                  onEditedNameChange={setEditedName}
                  onSaveEdit={() => handleSaveEdit(teammate.id)}
                  onCancelEdit={handleCancelEdit}
                  onStartEditing={() => handleStartEditing(teammate)}
                />
              </TableCell>
              <TableCell>
                <TeammateEmail email={teammate.email} />
              </TableCell>
              <TableCell>
                <TeammateRoleBadge role={teammate.role} />
              </TableCell>
              <TableCell>
                <TeammateStatusBadge status={teammate.status} />
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {teammate.lastActive ? format(new Date(teammate.lastActive), 'MMM d, yyyy') : 'Never'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Suspend</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TeammatesList;
